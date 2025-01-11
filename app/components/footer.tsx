import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-8 px-6 md:px-10 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold">Mind Scribe</Link>
          <p className="text-sm mt-2 text-gray-400">© 2025 Mind Scribe. All rights reserved.</p>
        </div>
        <nav>
          <ul className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
