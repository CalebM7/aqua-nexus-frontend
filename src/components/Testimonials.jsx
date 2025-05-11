// src/components/Testimonials.jsx
export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-aqua-light-bg">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-600 italic mb-4">
              "Finding a reliable borehole driller was stressful until I found AquaNexus. The process was smooth, and I got quotes quickly. Highly recommend!"
            </p>
            <div className="flex items-center">
              <img
                src="https://placehold.co/60x60/cccccc/ffffff?text=User1"
                alt="User 1"
                className="w-12 h-12 rounded-full mr-4 border-2 border-aqua-teal"
              />
              <div>
                <p className="font-semibold text-gray-800">Jane Wanjiru</p>
                <p className="text-sm text-gray-500">Homeowner, Nakuru</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <p className="text-gray-600 italic mb-4">
              "AquaNexus connected us with an excellent team for our community rainwater harvesting project. The platform made comparing providers easy."
            </p>
            <div className="flex items-center">
              <img
                src="https://placehold.co/60x60/cccccc/ffffff?text=User2"
                alt="User 2"
                className="w-12 h-12 rounded-full mr-4 border-2 border-aqua-teal"
              />
              <div>
                <p className="font-semibold text-gray-800">David Otieno</p>
                <p className="text-sm text-gray-500">Community Leader, Kisumu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}