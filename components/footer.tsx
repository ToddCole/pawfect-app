import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🐾</span>
              </div>
              <span className="text-xl font-bold">Pawfect Match</span>
            </div>
            <p className="text-neutral-300 mb-4 max-w-md">
              Helping families find their perfect canine companions through intelligent breed matching and expert guidance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.243 14.814 3.8 13.617 3.8 12.32c0-1.297.443-2.495 1.321-3.372.878-.878 2.03-1.321 3.328-1.321 1.297 0 2.448.443 3.328 1.321.878.877 1.32 2.075 1.32 3.372 0 1.297-.442 2.494-1.32 3.371-.88.807-2.031 1.297-3.328 1.297z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-neutral-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/guides" className="block text-neutral-300 hover:text-white transition-colors">
                Care Guides
              </Link>
              <Link href="/breeds" className="block text-neutral-300 hover:text-white transition-colors">
                Browse Breeds
              </Link>
              <Link href="/about" className="block text-neutral-300 hover:text-white transition-colors">
                About Us
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <nav className="space-y-2">
              <Link href="/help" className="block text-neutral-300 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-neutral-300 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-neutral-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-neutral-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/breed-manager" className="block text-orange-400 hover:text-orange-300 transition-colors font-semibold">
                🛠️ BREED DATABASE MANAGER
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 mt-8 text-center">
          <p className="text-neutral-400">
            © 2025 Pawfect Match. Made with ❤️ for dog lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}