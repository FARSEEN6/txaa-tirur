"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
    };

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Minimalist Hero */}
            <section className="bg-gray-50 py-24 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4 block">
                        Get in Touch
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">
                        Contact Us
                    </h1>
                    <p className="text-gray-500 text-sm tracking-wide max-w-xl mx-auto">
                        We're here to help with any questions about our products or your order.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-8">Customer Assistance</h2>
                        <div className="space-y-10 mb-12">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <Mail size={20} className="text-black" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Email</h3>
                                    <p className="text-gray-500 mb-1">support@foms.com</p>
                                    <p className="text-xs text-gray-400">Response within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <Phone size={20} className="text-black" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Phone</h3>
                                    <p className="text-gray-500 mb-1">+91 98765 43210</p>
                                    <p className="text-xs text-gray-400">Mon-Fri, 9am - 6pm IST</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={20} className="text-black" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Headquarters</h3>
                                    <p className="text-gray-500 mb-1">123 Automotive Plaza, Sector 4</p>
                                    <p className="text-gray-500">New Delhi, India 110001</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-10">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Connect With Us</h3>
                            <div className="flex gap-4">
                                {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="w-10 h-10 border border-gray-200 flex items-center justify-center text-gray-500 hover:border-black hover:text-black transition-all">
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-gray-50 p-10 lg:p-14">
                        <h2 className="text-2xl font-bold tracking-tight mb-8">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-gray-200 p-4 text-black focus:border-black transition-colors outline-none"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white border border-gray-200 p-4 text-black focus:border-black transition-colors outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Subject</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-200 p-4 text-black focus:border-black transition-colors outline-none"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Message</label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-white border border-gray-200 p-4 text-black focus:border-black transition-colors outline-none resize-none"
                                    placeholder="Write your message here..."
                                />
                            </div>
                            <button className="w-full py-4 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
                                Send Message <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
