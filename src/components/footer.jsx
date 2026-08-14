import React from 'react';
import { FaArrowUp, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import logoBks from '../assets/logo_bks.png';
import logoStation from '../assets/logo_station.png';

const quickLinks = [
  'ข้อมูลที่บริการ',
  'ตารางและสารสนเทศ',
  'บทความและสถิติ',
  'ข่าวประชาสัมพันธ์',
];

const passengerServices = [
  'ข้อมูลการนำโดยสาร (FAQ)',
  'นโยบายความเป็นส่วนตัว',
  'สิทธิการรับเงินคืน',
  'เงื่อนไขของการใช้บริการ',
];

const companyInfo = [
  '399 ถนนนรราภรณ์ ตำบลน้ำพึ่ง สำนักงาน',
  'จังหวัดนครราชสีมา, Nakhon Ratchasima, Thailand, 30000',
  '044 256 008',
  'สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่ 2',
];

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#1a1818] text-white">
      {/* Top Pink Bar */}
      <div className="h-12 bg-gradient-to-r from-[#f65ba1] via-[#ff7ba1] to-[#f65ba1] px-4 md:px-8 flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-xs md:text-sm font-semibold tracking-wide shadow-lg">
        <span className="whitespace-nowrap">ติดต่อ บบส.</span>
        <span className="hidden sm:inline text-white/40">•</span>
        <span className="whitespace-nowrap">@BKS99</span>
        <span className="hidden sm:inline text-white/40">•</span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <FaFacebookF className="text-xs" />
          บขส.
        </span>
        <span className="hidden sm:inline text-white/40">•</span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <FaFacebookF className="text-xs" />
          สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่ 2
        </span>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 py-12 md:py-16 bg-[#2d2b2d]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            
            {/* Column 1: Logo & Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex gap-4 mb-6 justify-center md:justify-start">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f65ba1] to-[#ff8fb3] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  <div className="relative flex h-20 w-20 items-center justify-center bg-white border-2 border-gray-300 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <img src={logoBks} alt="BKS" className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
                  </div>
                </div>
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f65ba1] to-[#ff8fb3] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  <div className="relative flex h-20 w-20 items-center justify-center bg-white border-2 border-gray-300 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                    <img src={logoStation} alt="Station" className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs text-white/70 font-medium leading-relaxed">
                  © 2026 สถานีขนส่งผู้โดยสาร<br/>
                  All Rights Reserved.
                </p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-base font-bold text-white mb-4 pb-3 border-b-2 border-[#f65ba1]">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-white/75 hover:text-[#ff8fb3] text-sm transition-all duration-200 hover:translate-x-1 inline-block hover:font-semibold"
                    >
                      → {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Passenger Services */}
            <div>
              <h3 className="text-base font-bold text-white mb-4 pb-3 border-b-2 border-[#f65ba1]">
                Passenger Services
              </h3>
              <ul className="space-y-2.5">
                {passengerServices.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-white/75 hover:text-[#ff8fb3] text-sm transition-all duration-200 hover:translate-x-1 inline-block hover:font-semibold"
                    >
                      → {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Social */}
            <div>
              <h3 className="text-base font-bold text-white mb-4 pb-3 border-b-2 border-[#f65ba1]">
                Contact & Social
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-[#ff8fb3]">☎</span>
                    <span className="text-xl font-bold text-white">1490</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Call Center<br/>
                    (24 ชั่วโมง)
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    สถานีขนส่งผู้โดยสาร<br/>
                    จังหวัด (แห่งที่ 2)
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <a 
                    href="#" 
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#ff8fb3] hover:text-[#2d2b2d] transition-all duration-200 hover:scale-110 shadow-md"
                    title="Facebook"
                  >
                    <FaFacebookF className="text-base" />
                  </a>
                  <a 
                    href="#" 
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#ff8fb3] hover:text-[#2d2b2d] transition-all duration-200 hover:scale-110 shadow-md"
                    title="LinkedIn"
                  >
                    <FaLinkedinIn className="text-base" />
                  </a>
                  <a 
                    href="#" 
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#ff8fb3] hover:text-[#2d2b2d] transition-all duration-200 hover:scale-110 shadow-md"
                    title="Twitter"
                  >
                    <FaTwitter className="text-base" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 px-4 md:px-8 py-6 bg-[#1a1818]">
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#f65ba1] to-[#ff8fb3] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
          >
            <FaArrowUp className="text-base" />
          </button>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-[#f65ba1] via-[#ff8fb3] to-[#f65ba1]"></div>
    </footer>
  );
}

export default Footer;
