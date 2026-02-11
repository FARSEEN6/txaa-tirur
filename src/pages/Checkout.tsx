
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "@/store/useCartStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ref, push, set } from "firebase/database";
import { rtdb } from "@/firebase/config";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck, Truck, CreditCard, Banknote, ArrowLeft, Check, ShoppingBag } from "lucide-react";

// Indian states list
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"
];

interface FormData {
    fullName: string;
    mobile: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: "razorpay" | "cod";
}

interface FormErrors {
    [key: string]: string;
}

export default function Checkout() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCartStore();
    const { settings, loading: settingsLoading, fetchSettings } = useSettingsStore();
    const { user } = useAuthStore();

    // Derived state
    const cartTotal = totalPrice();
    const cartItems = items;

    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        mobile: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
        paymentMethod: "razorpay" // Default to razorpay
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    // Redirect if cart is empty and not order placed
    useEffect(() => {
        if (cartItems.length === 0 && !orderPlaced) {
            // toast.error("Your cart is empty");
            // navigate("/shop");
        }
    }, [cartItems, orderPlaced, navigate]);

    // Validate mobile - only numbers, 10 digits, starts with 6-9
    const validateMobile = (value: string): string => {
        if (!value) return "Mobile number is required";
        if (!/^\d+$/.test(value)) return "Only numbers allowed";
        if (value.length !== 10) return "Must be 10 digits";
        if (!/^[6-9]/.test(value)) return "Must start with 6, 7, 8, or 9";
        return "";
    };

    // Validate pincode - 6 digits
    const validatePincode = (value: string): string => {
        if (!value) return "Pincode is required";
        if (!/^\d{6}$/.test(value)) return "Must be 6 digits";
        return "";
    };

    // Validate email
    const validateEmail = (value: string): string => {
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";
    };

    // Handle input change with validation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Mobile: only allow digits
        if (name === "mobile") {
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        // Pincode: only allow digits
        if (name === "pincode") {
            const numericValue = value.replace(/\D/g, "").slice(0, 6);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

        const mobileError = validateMobile(formData.mobile);
        if (mobileError) newErrors.mobile = mobileError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        if (!formData.address1.trim()) newErrors.address1 = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";

        const pincodeError = validatePincode(formData.pincode);
        if (pincodeError) newErrors.pincode = pincodeError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Razorpay payment
    const handleRazorpayPayment = async () => {
        if (cartItems.length === 0) return;

        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_1234567890",
                amount: cartTotal * 100, // Amount in paise
                currency: "INR",
                name: "TXAA Auto Accessories",
                description: `Order of ${cartItems.length} items`,
                image: "/txaa-logo.png",
                handler: async function (response: any) {
                    // Payment successful
                    await placeOrder(response.razorpay_payment_id);
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.mobile
                },
                theme: {
                    color: "#000000"
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        };
    };

    // Place order
    const placeOrder = async (paymentId?: string) => {
        if (cartItems.length === 0) return;

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity
                })),
                customer: {
                    fullName: formData.fullName,
                    mobile: formData.mobile,
                    email: formData.email,
                    userId: user?.uid || null
                },
                address: {
                    address1: formData.address1,
                    address2: formData.address2,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode
                },
                payment: {
                    method: formData.paymentMethod,
                    paymentId: paymentId || null,
                    status: formData.paymentMethod === "cod" ? "pending" : "paid"
                },
                status: "confirmed",
                total: cartTotal,
                createdAt: new Date().toISOString()
            };

            const newOrderRef = push(ref(rtdb, "orders"));
            await set(newOrderRef, orderData);

            setOrderId(newOrderRef.key);
            setOrderPlaced(true);
            clearCart();
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Failed to place order. Please try again.");
        }
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setSubmitting(true);

        try {
            if (formData.paymentMethod === "razorpay") {
                await handleRazorpayPayment();
            } else {
                await placeOrder();
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state
    if (settingsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-black" size={48} />
            </div>
        );
    }

    // Order success state
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-lg mx-auto px-4">
                    <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="text-green-600" size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your order. {formData.paymentMethod === "cod"
                                ? "Pay ₹" + cartTotal.toLocaleString("en-IN") + " on delivery."
                                : "Payment received successfully."}
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-gray-500 mb-1">Order ID</p>
                            <p className="font-mono text-sm text-gray-900">{orderId}</p>
                        </div>

                        <Link
                            to="/shop"
                            className="inline-block w-full py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Add some premium accessories to get started.</p>
                    <Link
                        to="/shop"
                        className="inline-block px-8 py-3 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        Browse Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/shop"
                        className="p-2 bg-white rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Details */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                    Customer Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.mobile ? 'border-red-500' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none`}
                                            placeholder="10-digit mobile number"
                                            inputMode="numeric"
                                        />
                                        {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none`}
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                    Delivery Address
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 1 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address1"
                                            value={formData.address1}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.address1 ? 'border-red-500' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none`}
                                            placeholder="House/Flat No., Street, Area"
                                        />
                                        {errors.address1 && <p className="text-red-500 text-xs mt-1">{errors.address1}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            name="address2"
                                            value={formData.address2}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                            placeholder="Landmark (optional)"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none`}
                                                placeholder="City"
                                            />
                                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border ${errors.state ? 'border-red-500' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none`}
                                            >
                                                <option value="">Select State</option>
                                                {INDIAN_STATES.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Pincode <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border ${errors.pincode ? 'border-red-500' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none`}
                                                placeholder="6-digit pincode"
                                                inputMode="numeric"
                                            />
                                            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    {settings.razorpayEnabled && (
                                        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === "razorpay"
                                            ? "border-black bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="razorpay"
                                                checked={formData.paymentMethod === "razorpay"}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-black focus:ring-black"
                                            />
                                            <CreditCard className="text-black" size={24} />
                                            <div>
                                                <p className="font-medium text-gray-900">Pay Online</p>
                                                <p className="text-sm text-gray-500">UPI, Credit/Debit Card, Net Banking</p>
                                            </div>
                                        </label>
                                    )}

                                    {settings.codEnabled && (
                                        <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === "cod"
                                            ? "border-black bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === "cod"}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-black focus:ring-black"
                                            />
                                            <Banknote className="text-green-600" size={24} />
                                            <div>
                                                <p className="font-medium text-gray-900">Cash on Delivery</p>
                                                <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button - Mobile */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="lg:hidden w-full py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    <>Place Order - ₹{cartTotal.toLocaleString("en-IN")}</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                            {/* Products List */}
                            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image || "/placeholder.jpg"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-black mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing */}
                            <div className="py-4 space-y-2 border-t border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">₹{cartTotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-black">₹{cartTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            {/* Submit Button - Desktop */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="hidden lg:flex w-full mt-6 py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-colors items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    <>Place Order</>
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <ShieldCheck size={16} className="text-green-600" />
                                    Secure checkout
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Truck size={16} className="text-blue-600" />
                                    Free delivery across India
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
