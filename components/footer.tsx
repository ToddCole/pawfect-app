import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Space */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-xl font-bold">🐾</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">PAWfect App</h3>
              <p className="text-sm text-gray-400">Dog breed explorer</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Navigation</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/breeds" className="block text-gray-300 hover:text-white transition-colors">
                All Breeds
              </Link>
              <Link href="/breeds/sample" className="block text-gray-300 hover:text-white transition-colors">
                Random Breed
              </Link>
              <Link href="/auth" className="block text-gray-300 hover:text-white transition-colors">
                Auth
              </Link>
            </nav>
          </div>

          {/* Testing & API Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Testing</h4>
            <nav className="space-y-2">
              <Link href="/test-supabase" className="block text-gray-300 hover:text-white transition-colors">
                Supabase Test
              </Link>
              <Link href="/api/ping" className="block text-gray-300 hover:text-white transition-colors">
                API Ping
              </Link>
              <Link href="/api/first-breed" className="block text-gray-300 hover:text-white transition-colors">
                First Breed API
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; 2024 PAWfect App. Built with Next.js and Supabase.</p>
        </div>
      </div>
    </footer>
  );
}