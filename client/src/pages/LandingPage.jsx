import React, { useEffect, useRef,useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useGSAP } from '@gsap/react';
import { MdKeyboardArrowLeft } from "react-icons/md";
import gsap from 'gsap';


const LandingPage = () => {
    const headingRef = useRef(null);
    const imgRef = useRef(null);
    const paraRef = useRef(null);
    const buttonsRef = useRef([]);
    const logosRef = useRef(null);
   

    const reviews = [
        {
            id: 1,
            name: "Robert Singh",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
            rating: 5,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis mollitia nemo obcaecati."
        },
        {
            id: 2,
            name: "Sarah Johnson",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
            rating: 5,
            text: "The AI-powered job matching is incredible. I found a perfect job in just 3 days after uploading my resume."
        },
        {
            id: 3,
            name: "David Chen",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
            rating: 4,
            text: "Great platform with an intuitive interface. The job recommendations were spot on for my skill set."
        },
        {
            id: 4,
            name: "Emily Rodriguez",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0",
            rating: 5,
            text: "I've tried many job sites before, but this one actually understands what kind of roles I'm looking for."
        },
        {
            id: 5,
            name: "Michael Taylor",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
            rating: 5,
            text: "The personalized career insights helped me focus on developing the skills that employers are really looking for."
        },
    ];
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const reviewsPerPage = 3;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);


    const getCurrentReviews = () => {
        const startIndex = currentIndex * reviewsPerPage;
        return reviews.slice(startIndex, startIndex + reviewsPerPage);
    };

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(headingRef.current, {
            x: -100,
            opacity: 0,
            duration: 0.5,
        })
            .from(paraRef.current, {
                x: -100,
                opacity: 0,
                duration: 0.5,
            })
            .from(imgRef.current, {
                x: 100,
                opacity: 0,
                duration: 0.5,
            })
            .from(buttonsRef.current, {
                y: 30,
                opacity: 0,
                stagger: 0.2,
                duration: 0.5,
                clearProps: 'opacity,transform',
            }, '-=0.3');
    }, []);

    // Animate logos scroll
    useGSAP(() => {
        const container = logosRef.current;
        const totalWidth = container.scrollWidth / 2; // Since logos are duplicated

        gsap.to(container, {
            x: `-=${totalWidth}`,
            duration: 30,
            ease: 'linear',
            repeat: -1,
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // Move to next page of reviews
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [totalPages]);

    // Animation when index changes
    useEffect(() => {
        if (carouselRef.current) {
            const cards = carouselRef.current.querySelectorAll('.review-card');

            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.2,
                    duration: 1,
                    ease: "power3.out"
                }
            );
        }
    }, [currentIndex]);

    const logos = [
        '/amazon.png',
        '/facebook.png',
        '/microsoft2.png',
        '/google2.png',
    ];

    return (
        <div className='bg-white min-h-screen w-full'>
            <Navbar />

            {/* Hero Section */}
            <div className='bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
                        <div className='space-y-8'>
                            <h1
                                ref={headingRef}
                                className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'
                                style={{ color: '#560edd' }}
                            >
                                Find Your Dream Job With AI-Powered Recommendations
                            </h1>
                            <p ref={paraRef} className='text-lg md:text-xl text-gray-600'>
                                Upload your resume and let our intelligent matching system find the perfect job opportunities tailored to your skills and experience.
                            </p>
                            <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
                                <Link
                                    ref={(el) => (buttonsRef.current[0] = el)}
                                    to='/login'
                                    className='px-6 py-3 text-lg font-medium text-white rounded-md shadow-md hover:shadow-lg transition duration-300'
                                    style={{ backgroundColor: '#560edd' }}
                                >
                                    Get Started
                                </Link>
                                <Link
                                    ref={(el) => (buttonsRef.current[1] = el)}
                                    to='/about'
                                    className='px-6 py-3 text-lg font-medium text-center rounded-md border hover:bg-gray-50 transition duration-300'
                                    style={{ color: '#560edd', borderColor: '#560edd' }}
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className='hidden md:block'>
                            <img
                                ref={imgRef}
                                src='https://img.freepik.com/free-vector/recruitment-concept-illustration_114360-6609.jpg'
                                alt='Job Search Illustration'
                                className='w-full h-auto rounded-lg'
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className='overflow-hidden py-6' style={{ backgroundColor: '#560edd' }}>
                <div className='relative w-full'>
                    <div ref={logosRef} className='flex w-max gap-16'>
                        {[...logos, ...logos].map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt='Logo'
                                className='h-10 md:h-12 object-contain'
                            />
                        ))}
                    </div>
                </div>
            </div>


            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl font-bold mb-4' style={{ color: '#560edd' }}>
                        Why Choose Our Platform?
                    </h2>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                        We combine cutting-edge AI with extensive job market data to provide you with unparalleled job matching.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {[
                        {
                            title: 'Smart Resume Parsing',
                            icon: '⚡',
                            desc: 'Our system intelligently extracts your skills, experience, and preferences from your resume to match you with relevant opportunities.',
                        },
                        {
                            title: 'Personalized Recommendations',
                            icon: '🔍',
                            desc: 'Get job recommendations tailored specifically to your profile, saving you hours of searching through irrelevant listings.',
                        },
                        {
                            title: 'Career Growth Insights',
                            icon: '📈',
                            desc: 'Receive insights about skills in demand and potential career paths based on your current profile and market trends.',
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className='bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border-t-4'
                            style={{ borderColor: '#560edd' }}
                        >
                            <div className='text-3xl mb-4' style={{ color: '#560edd' }}>
                                {feature.icon}
                            </div>
                            <h3 className='text-xl font-semibold mb-3'>{feature.title}</h3>
                            <p className='text-gray-600'>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>


            {/* reviews Section  */}
            <div className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: '#560edd' }}>What Our Users Say</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Don't just take our word for it. Here's what job seekers have to say about our platform.
                        </p>
                    </div>

                    <div
                        ref={carouselRef}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden"
                    >
                        {getCurrentReviews().map(review => (
                            <div
                                key={review.id}
                                className="review-card bg-white text-blue-600 p-8 rounded-xl shadow-md hover:shadow-lg 
                          transition duration-300 border-t-4 border-blue-600 flex flex-col items-center"
                            >
                                <h3 className="text-2xl mb-4">{review.name}</h3>
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={review.image}
                                        alt={review.name}
                                    />
                                </div>
                                <div className="text-yellow-400 text-2xl mb-2">
                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </div>
                                <p className="font-semibold text-gray-700 text-center">{review.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`mx-1 w-2 h-2 rounded-full ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='bg-gray-50 py-12'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='md:flex md:justify-between'>
                        <div className='mb-8 md:mb-0'>
                            <span className='text-2xl font-bold' style={{ color: '#560edd' }}>
                                Job Finder
                            </span>
                            <p className='mt-2 text-gray-600 max-w-xs'>
                                Connecting talented professionals with their dream opportunities.
                            </p>
                        </div>
                        <div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
                            {[
                                { title: 'Company', links: ['About', 'Careers', 'Contact'] },
                                { title: 'Resources', links: ['Blog', 'Help Center', 'FAQ'] },
                                { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
                            ].map((section, i) => (
                                <div key={i}>
                                    <h3 className='text-sm font-semibold text-gray-500 tracking-wider uppercase'>
                                        {section.title}
                                    </h3>
                                    <ul className='mt-4 space-y-2'>
                                        {section.links.map((link, j) => (
                                            <li key={j}>
                                                <a href='#' className='text-gray-600 hover:text-purple-600'>
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between'>
                        <p className='text-gray-500'>
                            © {new Date().getFullYear()} Job Finder. All rights reserved.
                        </p>
                        <div className='flex space-x-6 mt-4 md:mt-0'>
                            <a href='#' className='text-gray-400 hover:text-gray-500'>📱</a>
                            <a href='#' className='text-gray-400 hover:text-gray-500'>📷</a>
                            <a href='#' className='text-gray-400 hover:text-gray-500'>🐦</a>
                            <a href='#' className='text-gray-400 hover:text-gray-500'>💼</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
