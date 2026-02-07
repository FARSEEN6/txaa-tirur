"use client";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last updated: February 2026</p>

                <div className="space-y-8 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                        <p className="mb-4">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Personal information (name, email, phone number)</li>
                            <li>Billing and shipping address</li>
                            <li>Payment information</li>
                            <li>Order history and preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Process and fulfill your orders</li>
                            <li>Send order confirmations and updates</li>
                            <li>Respond to your comments and questions</li>
                            <li>Improve our products and services</li>
                            <li>Send promotional communications (with your consent)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to provide our services (e.g., shipping partners, payment processors).</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p className="mt-2"><strong>Email:</strong> privacy@txaa.com</p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
