import { useGSAP } from '@gsap/react';
import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navbarRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useGSAP(()=>{
    const links = gsap.utils.toArray(".nav-item");
    gsap.from(links, {
      y: -50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out"
    });
  })
  return (
    <nav className="bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex items-center">
            {/* <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold" style={{ color: '#560edd' }}>Job Finder</span>
            </Link> */}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link  to="/" className="nav-item px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-100" style={{ color: '#560edd' }}>
              Home
            </Link>
            <Link  to="/jobs" className="nav-item px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-100" style={{ color: '#560edd' }}>
              Jobs
            </Link>
            <Link  to="/about" className="nav-item px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-100" style={{ color: '#560edd' }}>
              About
            </Link>
            <Link  to="/contact" className="nav-item px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-100" style={{ color: '#560edd' }}>
              Contact
            </Link>
            <Link  to="/login" className="nav-item ml-4 px-4 py-2 rounded-md text-sm font-medium " style={{ color: '#560edd' }}>
              Login
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-100" style={{ color: '#560edd' }}>
            Home
          </Link>
          <Link to="/jobs" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-100" style={{ color: '#560edd' }}>
            Jobs
          </Link>
          <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-100" style={{ color: '#560edd' }}>
            About
          </Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-100" style={{ color: '#560edd' }}>
            Contact
          </Link>
          <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;