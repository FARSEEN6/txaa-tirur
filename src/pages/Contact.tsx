
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
    return (
        <div className="pt-24 min-h-screen bg-white text-black">
            <div className="container mx-auto px-6 py-12">
                <div className="mb-16 text-center">
                    <h1 className="text-4xl font-bold uppercase tracking-widest mb-6">Concierge Services</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        We are here to assist you with your inquiries. Contact our dedicated support team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="p-8 bg-gray-50 border border-gray-100">
                            <h3 className="text-xl font-bold uppercase tracking-wider mb-6">Get in Touch</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Phone className="text-black mt-1" size={20} />
                                    <div>
                                        <p className="text-sm font-bold uppercase text-gray-500 mb-1">Phone Support</p>
                                        <p className="text-lg">+91 98765 43210</p>
                                        <p className="text-xs text-gray-400">Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="text-black mt-1" size={20} />
                                    <div>
                                        <p className="text-sm font-bold uppercase text-gray-500 mb-1">Email</p>
                                        <p className="text-lg">concierge@txaa.com</p>
                                        <p className="text-xs text-gray-400">24/7 Priority Support</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MapPin className="text-black mt-1" size={20} />
                                    <div>
                                        <p className="text-sm font-bold uppercase text-gray-500 mb-1">Headquarters</p>
                                        <p className="text-lg">Tirur, Kerala</p>
                                        <p className="text-xs text-gray-400">India</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Form */}
                    <div className="p-8 bg-white border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold uppercase tracking-wider mb-6">Send a Message</h3>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                                <input type="text" className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors bg-transparent" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                                <input type="email" className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors bg-transparent" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Message</label>
                                <textarea className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors bg-transparent h-32 resize-none" placeholder="How can we help?" />
                            </div>
                            <button type="submit" className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
