export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              AquaNexus
            </h4>
            <p className="text-sm">
              Connecting Kenya to sustainable water solutions.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-teal-500">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-500">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-500">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Nairobi, Kenya</li>
              <li>+254 700 000 000</li>
              <li>support@aquanexus.ke</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-teal-500">
                <i className="fab fa-facebook-f fa-lg"></i>
              </a>
              <a href="#" className="hover:text-teal-500">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="hover:text-teal-500">
                <i className="fab fa-linkedin-in fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          © 2025 AquaNexus. All rights reserved.
        </div>
      </div>
    </footer>
  )
}