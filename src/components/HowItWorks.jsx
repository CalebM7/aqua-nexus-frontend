// src/components/HowItWorks.jsx
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-aqua-light-bg">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">How AquaNexus Works</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          A simple, transparent process to get your water project done right.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          <div className="flex flex-col items-center">
            <div className="bg-aqua-teal text-white rounded-full p-6 mb-4 shadow-md">
              <i className="fas fa-file-alt fa-3x"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">1. Post Your Project</h3>
            <p className="text-gray-600">
              Describe your rainwater harvesting or borehole needs. It's free and takes minutes.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-aqua-teal text-white rounded-full p-6 mb-4 shadow-md">
              <i className="fas fa-users fa-3x"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">2. Compare Bids</h3>
            <p className="text-gray-600">
              Receive competitive quotes from certified and vetted local providers.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-aqua-teal text-white rounded-full p-6 mb-4 shadow-md">
              <i className="fas fa-shield-alt fa-3x"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">3. Hire & Secure Payment</h3>
            <p className="text-gray-600">
              Choose the best provider and manage payments securely through our platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}