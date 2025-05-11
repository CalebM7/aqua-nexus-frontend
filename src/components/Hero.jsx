// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="relative bg-aqua-blue text-white py-20 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080/ffffff/cccccc?text=Water+System+Illustration')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="wave-divider">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 50 C 360 100, 1080 0, 1440 50 L 1440 100 L 0 100 Z" fill="#F5F5F5"></path>
        </svg>
      </div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Connecting Kenya to Trusted Water Solutions
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Post your project, compare bids, and hire certified providers for rainwater harvesting and borehole drilling.
        </p>
        <div className="space-x-4">
          <a
            href="#"
            className="bg-aqua-green text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-opacity-90 transition duration-300 shadow-lg"
          >
            Post a Project
          </a>
          <a
            href="#providers"
            className="bg-white text-aqua-blue px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg"
          >
            Browse Providers
          </a>
        </div>
      </div>
    </section>
  );
}