'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Twitter, Linkedin, Facebook, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { footerLinks } from '@/lib/landing-data';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setMessage('Thank you for subscribing!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-white">EduNexus</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Complete School Management System
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: 'https://twitter.com/edunexus', label: 'Twitter' },
                { icon: Linkedin, href: 'https://linkedin.com/company/edunexus', label: 'LinkedIn' },
                { icon: Facebook, href: 'https://facebook.com/edunexus', label: 'Facebook' },
                { icon: Youtube, href: 'https://youtube.com/edunexus', label: 'YouTube' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="h-5 w-5 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Solutions
            </h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to our newsletter for updates, tips, and product news
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary"
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>

            {message && (
              <p className={`mt-2 text-sm ${message.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} EduNexus. All rights reserved.
            </p>

            <p className="text-sm text-gray-400">
              Made with ❤️ for educators worldwide
            </p>

            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
