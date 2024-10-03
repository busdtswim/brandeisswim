import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-[#003478] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Brandeis swimming lessons</div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="text-white hover:text-cyan-300">HOME</Link></li>
            <li><Link href="/register" className="text-white hover:text-cyan-300">REGISTER</Link></li>
            <li><Link href="/login" className="text-white hover:text-cyan-300">LOGIN</Link></li>
            <li><Link href="/contact" className="text-white hover:text-cyan-300 flex items-center"><Mail className="mr-1" size={18} />CONTACT</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}