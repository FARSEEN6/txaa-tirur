
export default function About() {
    return (
        <div className="pt-24 min-h-screen bg-white text-black">
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-8">Role of Excellence</h1>
                    <div className="w-20 h-1 bg-black mx-auto mb-8"></div>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        At TXAA, we believe that true luxury lies in the details. Our mission is to transform your vehicle into a bespoke masterpiece that reflects your distinct style and personality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                        <img
                            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop"
                            alt="Luxury Car Interior"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold uppercase tracking-widest mb-6">Our Craft</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Founded in Tirur, Kerala, TXAA has established itself as a premier destination for high-quality automotive accessories. We source only the finest materials and components, ensuring that every product meets our rigorous standards of durability and aesthetics.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            From precision-engineered performance parts to elegant interior enhancements, our curated collection allows you to customize every aspect of your driving experience. using state-of-the-art technology and timeless design principles.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-16 text-center">
                    <h3 className="text-2xl font-bold uppercase tracking-widest mb-6">Join the Elite</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Experience the difference that quality makes. Browse our exclusive collection today.
                    </p>
                </div>
            </div>
        </div>
    );
}
