// Home.jsx
import React from 'react';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content Section */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl leading-tight">
                Secure Academic Certificate Vault
              </h1>
              <p className="text-lg text-black/70 leading-relaxed">
                Store, manage, and verify your academic credentials with blockchain-powered security. 
                Never worry about lost certificates again.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Securely Verified</h3>
                  <p className="text-sm text-black/60">Every certificate is cryptographically secured and tamper-proof</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Instant Verification</h3>
                  <p className="text-sm text-black/60">Employers can verify credentials in seconds, not days</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Always Accessible</h3>
                  <p className="text-sm text-black/60">Access your certificates anytime, anywhere, from any device</p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-black/10">
             
            </div>
          </div>

          {/* Right Image Section */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
              {/* REPLACE THIS SECTION WITH YOUR IMAGE */}
              <img 
                src="/images/certificate.png" 
                alt="Secure Certificate Vault Illustration" 
                className="w-full h-full object-cover"
              />
              
              {/* Remove this placeholder when you add your image */}
              {/* <div className="text-center p-8">
                <svg className="w-32 h-32 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 font-medium">Certificate Vault</p>
              </div> */}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-black/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white mt-20">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-bold text-xl">
                  S
                </div>
                <span className="text-xl font-bold">Securo</span>
              </div>
              <p className="text-sm text-black/60 max-w-md">
                The most secure way to store, manage, and verify your academic certificates. Built with advanced encryption and unique digital identifiers for tamper-proof verification.
              </p>
            </div>
            
            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-black/60">
                <li><a href="#features" className="hover:text-black transition">Features</a></li>
                <li><a href="#security" className="hover:text-black transition">Security</a></li>
                <li><a href="#pricing" className="hover:text-black transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-black transition">FAQ</a></li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-black/60">
                <li><a href="#about" className="hover:text-black transition">About Us</a></li>
                <li><a href="#contact" className="hover:text-black transition">Contact</a></li>
                <li><a href="#privacy" className="hover:text-black transition">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-black transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 border-t border-black/10 pt-8 text-center text-sm text-black/60">
            <p>&copy; {new Date().getFullYear()} Securo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}