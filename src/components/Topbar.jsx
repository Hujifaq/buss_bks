import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiMapPin, FiClock } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { FaBus } from 'react-icons/fa';
import gsap from 'gsap';
import HamburgerMenu from './HamburgerMenu';

function Topbar() {
  const navigate = useNavigate();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('TH');

  const chevronRef = useRef(null);
  const searchModalBgRef = useRef(null);
  const searchModalContentRef = useRef(null);
  const langIconRef = useRef(null);

  // Animate language icon on change
  useEffect(() => {
    if (langIconRef.current) {
      gsap.fromTo(langIconRef.current,
        { scale: 0.2, rotation: -90, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
      );
    }
  }, [selectedLang]);

  // Dropdown chevron animation
  useEffect(() => {
    if (chevronRef.current) {
      gsap.to(chevronRef.current, {
        rotation: isDropdownOpen ? 180 : 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isDropdownOpen]);

  // Search Modal Entry Animation
  useEffect(() => {
    if (isSearchModalOpen && searchModalBgRef.current && searchModalContentRef.current) {
      gsap.fromTo(searchModalBgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(searchModalContentRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.1 }
      );
    }
  }, [isSearchModalOpen]);

  // Search Modal Exit Animation
  const closeSearchModal = () => {
    if (searchModalBgRef.current && searchModalContentRef.current) {
      gsap.to(searchModalContentRef.current.children, {
        y: -20, opacity: 0, duration: 0.2, stagger: 0.05, ease: "power2.in"
      });
      gsap.to(searchModalBgRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.1,
        onComplete: () => setIsSearchModalOpen(false)
      });
    } else {
      setIsSearchModalOpen(false);
    }
  };

  const UKFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="100%" height="100%" className="rounded-full">
      <clipPath id="t"><path d="M30,30 h30 v30 z v30 h-30 z h-30 v-30 z v-30 h30 z" /></clipPath>
      <path d="M0,0 v60 h60 v-60 z" fill="#012169" />
      <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,60 M60,0 L0,60" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v60 M0,30 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v60 M0,30 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );

  return (
    <>
      <div className="flex flex-col w-full sticky top-0 z-40">

        <div className={`flex items-center justify-between px-4 md:px-24 py-2 w-full relative z-50 transition-colors duration-300 ${isDropdownOpen ? 'bg-[#ffe4eb]' : 'bg-white'}`}>

          {/* Left: Language Selection */}
          <div className="relative">
            <div
              ref={langIconRef}
              className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer shadow-sm border border-gray-100 flex items-center justify-center transition-transform hover:scale-105"
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                if (isDropdownOpen) setIsDropdownOpen(false);
              }}
              style={selectedLang === 'TH'
                ? { background: 'linear-gradient(to bottom, #ED1C24 16.6%, #ffffff 16.6%, #ffffff 33.3%, #241D4F 33.3%, #241D4F 66.6%, #ffffff 66.6%, #ffffff 83.3%, #ED1C24 83.3%)' }
                : {}
              }
              title={selectedLang === 'TH' ? "Thai Language" : "English Language"}
            >
              {selectedLang === 'EN' && <UKFlag />}
            </div>

            {/* Language Dropdown */}
            {isLangDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangDropdownOpen(false)}
                />
                <div className="absolute top-10 left-0 bg-white shadow-xl rounded-xl border border-gray-100 w-28 py-2 z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                  <button
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-800 transition-colors font-medium"
                    onClick={() => { setSelectedLang('TH'); setIsLangDropdownOpen(false); }}
                  >
                    <div className="w-5 h-5 rounded-full border border-gray-200 shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #ED1C24 16.6%, #ffffff 16.6%, #ffffff 33.3%, #241D4F 33.3%, #241D4F 66.6%, #ffffff 66.6%, #ffffff 83.3%, #ED1C24 83.3%)' }} />
                    Thai
                  </button>
                  <button
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-800 transition-colors font-medium"
                    onClick={() => { setSelectedLang('EN'); setIsLangDropdownOpen(false); }}
                  >
                    <div className="w-5 h-5 rounded-full border border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center">
                      <UKFlag />
                    </div>
                    Eng
                  </button>
                </div>
              </>
            )}
          </div>

          <div
            className="flex items-center justify-center gap-1 cursor-pointer"
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              if (isLangDropdownOpen) setIsLangDropdownOpen(false);
            }}
          >
            <img src="/src/assets/logo_bks.png" alt="BKS Logo" className="h-20 w-auto object-contain" />
            <div className="w-4 h-4 mt-3 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              <div ref={chevronRef} className="flex items-center justify-center">
                <FiChevronDown size={14} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-black">
            {/* Mobile Search Icon */}
            <div 
              className="w-9 h-9 md:hidden flex items-center justify-center rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-500 transition-colors cursor-pointer"
              onClick={() => {
                setIsSearchModalOpen(true);
                if (isDropdownOpen) setIsDropdownOpen(false);
                if (isLangDropdownOpen) setIsLangDropdownOpen(false);
              }}
              title="Search"
            >
              <FiSearch size={20} />
            </div>
            
            {/* Enhanced Hamburger Menu Component */}
            <HamburgerMenu
              isOpen={isDesktopMenuOpen}
              setIsOpen={(val) => {
                setIsDesktopMenuOpen(val);
                if (val) {
                  if (isDropdownOpen) setIsDropdownOpen(false);
                  if (isLangDropdownOpen) setIsLangDropdownOpen(false);
                }
              }}
              onOpenSearchModal={() => {
                setIsSearchModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`bg-[#ffe4eb] w-full overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="flex items-start justify-center gap-4 px-4 pt-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <FaBus size={20} className="text-[#ff7a00]" />
              </div>
              <span className="text-xs font-bold text-black">รถทัวร์</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              </div>
              <span className="text-xs font-bold text-black">รถตู้</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              </div>
              <span className="text-xs font-bold text-black">รถสองแถว</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div
          ref={searchModalBgRef}
          className="fixed inset-0 z-50 bg-white flex flex-col p-5"
        >
          <div ref={searchModalContentRef} className="flex flex-col h-full w-full max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black tracking-tight text-gray-900">Search</h2>
              <button
                onClick={closeSearchModal}
                className="p-2 rounded-full bg-[#ffe4eb] text-[#ff7a00] hover:scale-105 transition-transform"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            {/* Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (modalSearchQuery.trim()) {
                  closeSearchModal();
                  navigate(`/bus-stops?q=${encodeURIComponent(modalSearchQuery.trim())}`);
                }
              }}
              className="relative mb-8"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-[#ff7a00]" size={22} />
              </div>
              <input
                type="text"
                autoFocus
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                placeholder="Where to? (Press Enter to search)"
                className="w-full bg-gray-50 border-2 border-transparent text-gray-900 rounded-2xl py-4 pl-12 pr-4 text-lg font-medium placeholder-gray-400 outline-none transition-all shadow-sm focus:border-pink-300"
              />
            </form>



          </div>
        </div>
      )}


    </>
  );
}

export default Topbar;
