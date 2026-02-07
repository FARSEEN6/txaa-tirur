"use client";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <p className="text-gray-500 mb-8">Last updated: February 2026</p>

                <div className="space-y-8 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using TXAA Automotive website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Products and Services</h2>
                        <p className="mb-4">TXAA Automotive offers premium car accessories including but not limited to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Seat covers and interior accessories</li>
                            <li>Floor mats and car mats</li>
                            <li>LED lights and ambient lighting</li>
                            <li>Number plate frames and stickers</li>
                            <li>Car care products</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Orders and Payment</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                            <li>We accept major credit/debit cards, UPI, and net banking</li>
                            <li>Orders are subject to availability and confirmation</li>
                            <li>We reserve the right to refuse or cancel any order</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Shipping and Delivery</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Free shipping on orders above ₹999</li>
                            <li>Delivery within 5-7 business days for most locations</li>
                            <li>Remote areas may take additional 2-3 days</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Returns and Refunds</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>7-day return policy for unused products in original packaging</li>
                            <li>Refunds processed within 5-7 business days</li>
                            <li>Custom/personalized items are non-returnable</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
                        <p>For any questions regarding these terms, please contact us at:</p>
                        <p className="mt-2"><strong>Email:</strong> support@txaa.com</p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
