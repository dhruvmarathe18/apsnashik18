'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Send,
  ArrowRight,
  Youtube
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Admissions', href: '/contact' },
    { name: 'Academics', href: '/academics' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'School Info', href: '/school-info' },
    { name: 'Contact', href: '/contact' },
  ]

  const academicLinks = [
    { name: 'Curriculum', href: '/academics#curriculum' },
    { name: 'Teaching Methods', href: '/academics#methods' },
    { name: 'Student Support', href: '/academics#support' },
    { name: 'Academic Calendar', href: '/academics#calendar' },
    { name: 'Examination', href: '/academics#examination' },
    { name: 'Results', href: '/academics#results' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/appleschool1/', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'bg-blue-400 hover:bg-blue-500' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'bg-blue-700 hover:bg-blue-800' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'bg-red-600 hover:bg-red-700' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* School Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/images/aps.jpg" 
                alt="APS Nashik" 
                className="w-14 h-14 rounded-lg shadow-lg"
              />
              <div>
                <h3 className="text-xl font-bold text-white">APS Nashik</h3>
                <p className="text-sm text-gray-400">Apple Public School</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              A space for childhood to bloom naturally, empowering students to create solutions for tomorrow's challenges.
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>+91 9226166369</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>info@apsnashik.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>Nashik, Maharashtra, India</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <Clock className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>Mon - Fri: 8:00 AM - 3:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Academics</h4>
            <ul className="space-y-3">
              {academicLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Stay Connected</h4>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Subscribe to our newsletter to stay updated with our latest news and events.
            </p>
            <form className="space-y-3 mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 ${social.color} rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Apple Public School Nashik. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/about" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link href="/about" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
