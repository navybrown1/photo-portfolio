import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mail, Instagram, Twitter, X, Menu, ChevronRight, ExternalLink, Heart, MapPin, ChevronLeft, Send, ArrowRight, MousePointer2 } from 'lucide-react';

// --- Mock Data ---
const PORTFOLIO_ITEMS = [
  {
    id: 1,
    category: 'Landscape',
    title: 'Misty Mountains',
    location: 'Swiss Alps',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    description: 'Early morning fog rolling over the peaks.'
  },
  {
    id: 2,
    category: 'Portrait',
    title: 'Urban Solitude',
    location: 'Tokyo, Japan',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80',
    description: 'A moment of quiet in the busy city.'
  },
  {
    id: 3,
    category: 'Nature',
    title: 'Fern Detail',
    location: 'Pacific Northwest',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    description: 'Detailed macro shot of forest flora.'
  },
  {
    id: 4,
    category: 'Architecture',
    title: 'Glass Giants',
    location: 'New York, USA',
    url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    description: 'Reflections on modern skyscrapers.'
  },
  {
    id: 5,
    category: 'Landscape',
    title: 'Golden Hour Coast',
    location: 'Big Sur, CA',
    url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
    description: 'Sunset hitting the rugged coastline.'
  },
  {
    id: 6,
    category: 'Portrait',
    title: 'Studio Light',
    location: 'Studio A',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    description: 'High contrast black and white portrait.'
  },
  {
    id: 7,
    category: 'Architecture',
    title: 'Spiral Staircase',
    location: 'Vatican Museums',
    url: 'https://images.unsplash.com/photo-1516893842880-5d8aada7ac05?auto=format&fit=crop&w=1200&q=80',
    description: 'Looking down the famous spiral.'
  },
  {
    id: 8,
    category: 'Nature',
    title: 'Fox in Snow',
    location: 'Hokkaido, Japan',
    url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80',
    description: 'Winter wildlife photography.'
  }
];

const CATEGORIES = ['All', 'Landscape', 'Portrait', 'Nature', 'Architecture'];

// --- Components ---

// Custom Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (cursorRef.current && cursorDotRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    
    const onMouseDown = () => {
      if (cursorRef.current) cursorRef.current.classList.add('scale-75');
    };
    
    const onMouseUp = () => {
      if (cursorRef.current) cursorRef.current.classList.remove('scale-75');
    };

    // Add hover effect for interactive elements
    const handleHoverStart = () => cursorRef.current?.classList.add('scale-150', 'mix-blend-difference', 'bg-white');
    const handleHoverEnd = () => cursorRef.current?.classList.remove('scale-150', 'mix-blend-difference', 'bg-white');

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .cursor-hover');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[100] -ml-4 -mt-4 transition-transform duration-100 ease-out hidden md:block mix-blend-difference" />
      <div ref={cursorDotRef} className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[100] -ml-0.5 -mt-0.5 hidden md:block" />
    </>
  );
};

// Scroll Reveal Component
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: '50px' });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 cubic-bezier(0.17, 0.55, 0.55, 1) ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? PORTFOLIO_ITEMS 
    : PORTFOLIO_ITEMS.filter(item => item.category === activeCategory);

  const Navigation = () => (
    <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-black/80 backdrop-blur-lg border-zinc-800 py-4' : 'bg-transparent border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="text-2xl font-bold tracking-tighter cursor-pointer flex items-center gap-2 text-white group"
          onClick={() => setActiveTab('home')}
        >
          <div className="relative">
            <Camera className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
            <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="tracking-[0.2em]">LUMINA</span>
        </div>

        <div className="hidden md:flex gap-1">
          {['Home', 'Gallery', 'About', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              className={`px-6 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-300 relative overflow-hidden group ${activeTab === item.toLowerCase() ? 'text-black' : 'text-gray-400 hover:text-white'}`}
            >
              {activeTab === item.toLowerCase() && (
                <span className="absolute inset-0 bg-white rounded-full transition-all duration-300" />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          ))}
        </div>

        <button 
          className="md:hidden text-white p-2 hover:bg-zinc-800 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-800 p-4 flex flex-col gap-2 md:hidden animate-in slide-in-from-top-5">
          {['Home', 'Gallery', 'About', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveTab(item.toLowerCase());
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-gray-300 hover:text-white hover:bg-zinc-900 px-4 py-3 rounded-lg transition-colors uppercase text-sm tracking-wider"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );

  const Hero = () => (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1920&q=80')`,
          transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-zinc-950" />
      </div>

      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto mt-20 mix-blend-difference">
        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-white/50" />
            <p className="text-sm md:text-base tracking-[0.4em] uppercase text-gray-200">Photography Portfolio</p>
            <div className="h-px w-12 bg-white/50" />
          </div>
        </Reveal>
        
        <Reveal delay={200}>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9] select-none">
            CAPTURING<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">THE UNSEEN</span>
          </h1>
        </Reveal>

        <Reveal delay={400}>
          <button 
            onClick={() => setActiveTab('gallery')}
            className="group relative px-8 py-4 overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm rounded-full hover:border-white transition-colors duration-300"
          >
            <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
            <span className="relative flex items-center gap-2 text-sm uppercase tracking-widest font-medium">
              Explore Gallery
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </Reveal>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
        <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );

  const Gallery = () => (
    <div className="pt-32 pb-20 min-h-screen bg-zinc-950 px-4 md:px-8" id="gallery">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-2">Selected Works</h2>
              <p className="text-gray-400 max-w-md">A collection of moments frozen in time, exploring the relationship between light, nature, and humanity.</p>
            </div>
            
            <div className="flex flex-wrap justify-start md:justify-end gap-2 p-1 bg-white/5 rounded-full border border-white/10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 relative ${
                    activeCategory === cat ? 'text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activeCategory === cat && (
                    <span className="absolute inset-0 bg-white rounded-full shadow-lg animate-in fade-in zoom-in duration-200" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {filteredImages.map((item, index) => (
            <Reveal key={item.id} delay={index * 100}>
              <div 
                className="group relative break-inside-avoid cursor-none overflow-hidden rounded-sm"
                onClick={() => setSelectedImage(item)}
              >
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                  loading="lazy"
                />
                
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2 block">{item.category}</span>
                      <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-300 text-sm flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );

  const About = () => (
    <div className="pt-32 pb-20 min-h-screen bg-zinc-950 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-white/5 mb-12 absolute -top-20 left-0 select-none">ABOUT ME</h1>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2 relative">
            <Reveal delay={200}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="aspect-[3/4] relative overflow-hidden rounded-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&w=800&q=80" 
                    alt="Photographer" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                </div>
                {/* Floater Card */}
                <div className="absolute -bottom-6 -right-6 bg-white text-black p-6 rounded-xl shadow-2xl max-w-[200px] hidden md:block">
                  <p className="font-bold text-2xl mb-1">100%</p>
                  <p className="text-sm text-gray-600 leading-tight">Dedication to capturing the perfect moment.</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="w-full md:w-1/2 text-white space-y-8">
            <Reveal delay={300}>
              <h2 className="text-5xl font-bold tracking-tight mb-6">Visual Storyteller & <br /><span className="text-gray-400">Light Chaser.</span></h2>
            </Reveal>
            
            <Reveal delay={400}>
              <p className="text-xl text-gray-300 leading-relaxed font-light">
                I'm Alex, a photographer obsessed with light and shadow. I believe every frame holds a story waiting to be told. My journey began with a simple film camera and has taken me to the furthest corners of the globe.
              </p>
            </Reveal>

            <Reveal delay={500}>
              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                  <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Specialization</h4>
                  <p className="text-lg font-medium">Landscape, Editorial, Urban</p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Based In</h4>
                  <p className="text-lg font-medium">San Francisco, CA</p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Experience</h4>
                  <p className="text-lg font-medium">10+ Years Professional</p>
                </div>
                <div>
                  <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Gear</h4>
                  <p className="text-lg font-medium">Sony Alpha, Leica M</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={600}>
              <button className="mt-4 border-b border-white pb-1 hover:opacity-50 transition-opacity uppercase tracking-widest text-sm">
                Download Resume
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );

  const Contact = () => {
    const [formState, setFormState] = useState('idle'); // idle, sending, success

    const handleSubmit = (e) => {
      e.preventDefault();
      setFormState('sending');
      setTimeout(() => {
        setFormState('success');
        setTimeout(() => setFormState('idle'), 3000);
      }, 1500);
    };

    return (
      <div className="pt-32 pb-20 min-h-screen bg-zinc-950 px-4 flex items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-10">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">Let's create <br />something <span className="text-outline-white">iconic.</span></h2>
            </Reveal>
            
            <Reveal delay={200}>
              <p className="text-gray-400 text-xl max-w-md">
                Available for freelance projects, commercial work, and prints. Drop me a line and let's discuss your vision.
              </p>
            </Reveal>
            
            <Reveal delay={300}>
              <div className="space-y-6">
                <a href="#" className="flex items-center gap-6 text-white hover:text-gray-300 transition-all group p-4 border border-white/5 hover:border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
                  <div className="bg-white/10 p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email Me</span>
                    <span className="text-xl font-medium">hello@lumina.photo</span>
                  </div>
                </a>
                
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                    <MousePointer2 className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={400}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-zinc-900 to-black p-8 md:p-10 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden">
              {formState === 'success' ? (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900/95 backdrop-blur text-center p-8 animate-in fade-in">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                    <Send className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">I'll get back to you within 24 hours.</p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Name</label>
                  <input required type="text" className="w-full bg-zinc-950/50 border border-zinc-800 text-white p-4 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                  <input required type="email" className="w-full bg-zinc-950/50 border border-zinc-800 text-white p-4 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Message</label>
                <textarea required rows={4} className="w-full bg-zinc-950/50 border border-zinc-800 text-white p-4 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all resize-none" placeholder="Tell me about your project..." />
              </div>
              <button 
                disabled={formState === 'sending'}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formState === 'sending' ? (
                  <>Sending...</>
                ) : (
                  <>Send Message <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    );
  };

  const Lightbox = () => {
    if (!selectedImage) return null;

    const navigateImage = (direction) => {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
      let newIndex;
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % filteredImages.length;
      } else {
        newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
      }
      setSelectedImage(filteredImages[newIndex]);
    };

    return (
      <div className="fixed inset-0 z-[60] bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
        <button 
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 hover:rotate-90 duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <X className="w-8 h-8" />
        </button>

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-12 pointer-events-none">
          <button 
            className="pointer-events-auto bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur transition-all transform hover:scale-110"
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            className="pointer-events-auto bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-full backdrop-blur transition-all transform hover:scale-110"
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        <div className="max-w-7xl w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
          <div className="relative flex-1 h-full flex items-center justify-center">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500"
            />
          </div>
          <div className="md:w-80 text-left space-y-6 animate-in slide-in-from-right-8 duration-500 delay-100">
            <div>
              <span className="text-yellow-500 text-sm font-bold uppercase tracking-wider">{selectedImage.category}</span>
              <h3 className="text-3xl font-bold text-white mt-2">{selectedImage.title}</h3>
            </div>
            <div className="h-px w-full bg-white/10" />
            <p className="text-gray-300 leading-relaxed">{selectedImage.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              {selectedImage.location}
            </div>
            <div className="pt-4">
              <button className="w-full border border-white text-white hover:bg-white hover:text-black py-3 px-6 rounded-lg transition-all uppercase text-xs tracking-widest font-bold">
                Buy Print
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-white selection:text-black cursor-none">
      <CustomCursor />
      <Navigation />
      
      <main>
        {activeTab === 'home' && (
          <>
            <Hero />
            <Gallery />
          </>
        )}
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'about' && <About />}
        {activeTab === 'contact' && <Contact />}
      </main>

      <Lightbox />

      <footer className="bg-black py-12 border-t border-zinc-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-white" />
            <span className="font-bold tracking-tight">LUMINA</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Lumina Photography. All rights reserved.
          </div>
          <div className="flex gap-4 text-gray-400">
            <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Mail className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        /* Additional utility classes for text outline effect */
        .text-outline-white {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Hide default cursor */
        body, a, button, input, textarea {
          cursor: none;
        }

        @media (max-width: 768px) {
          body, a, button, input, textarea {
            cursor: auto;
          }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #09090b;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
    </div>
  );
}
