import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FiMapPin, FiCalendar, FiSearch, FiClock, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { FaExchangeAlt, FaBus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Guidebook from '../components/Guidebook';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const AutocompleteInput = ({ value, onChange, placeholder, icon: Icon, locations, isOrigin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = locations.filter(loc => loc.searchString.includes(value.toLowerCase()));

  return (
    <div className="w-full lg:flex-1 relative group" ref={wrapperRef}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className={`${isOrigin ? 'text-pink-500' : 'text-gray-400'} group-focus-within:text-pink-500 group-focus-within:scale-110 transition-transform`} size={20} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 py-4 text-gray-800 focus:outline-none focus:bg-white transition-all font-medium text-lg h-full"
      />

      {/* Dropdown Menu */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] max-h-60 overflow-y-auto">
          {filtered.map((loc, idx) => (
            <div
              key={idx}
              className="px-5 py-3 hover:bg-[#fff0f5] cursor-pointer text-gray-700 transition-colors border-b border-gray-50 last:border-0"
              onClick={() => {
                onChange(loc.value);
                setIsOpen(false);
              }}
            >
              <div className="font-bold text-[#241D4F]">{loc.value}</div>
              {loc.enValue && <div className="text-xs text-gray-400">{loc.enValue}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Guide Step Panel ──
const GuideStep = React.forwardRef(({ step, index, total }, ref) => {
  const Icon = step.icon;
  const isLast = index === total - 1;
  const accentColors = ['#ec4899', '#6366f1', '#f97316'];
  const accent = accentColors[index] || '#ec4899';

  return (
    <div
      ref={ref}
      className="guide-step"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0',
        width: '100%',
        minHeight: '340px',
        position: 'relative',
      }}
    >
      {/* Left: giant step number */}
      <div
        className="guide-step-number"
        style={{
          flex: '0 0 auto',
          width: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: 'clamp(80px, 12vw, 140px)',
            fontWeight: 900,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: `2px ${accent}`,
            letterSpacing: '-0.06em',
            userSelect: 'none',
          }}
        >
          {step.step}
        </span>
      </div>

      {/* Center: content */}
      <div
        className="guide-step-body"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '40px 0',
        }}
      >
        <div className="guide-step-icon-row" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `${accent}12`,
              border: `1.5px solid ${accent}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent,
            }}
          >
            <Icon size={22} />
          </div>
          <div
            style={{
              height: '1px',
              flex: 1,
              maxWidth: '80px',
              background: `linear-gradient(to right, ${accent}40, transparent)`,
            }}
          />
        </div>

        <h3
          className="guide-step-title"
          style={{
            fontSize: 'clamp(22px, 3vw, 30px)',
            fontWeight: 800,
            color: '#1e1b4b',
            lineHeight: 1.3,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          {step.title}
        </h3>

        <p
          className="guide-step-desc"
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#64748b',
            lineHeight: 1.7,
            margin: 0,
            maxWidth: '480px',
          }}
        >
          {step.desc}
        </p>

        {!isLast && (
          <div
            className="guide-step-next"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 700,
              color: accent,
              marginTop: '8px',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            <span>ขั้นตอนถัดไป</span>
            <FiArrowRight size={14} />
          </div>
        )}
      </div>

      {/* Right: decorative ring */}
      <div
        className="guide-step-ring"
        style={{
          flex: '0 0 auto',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `2px solid ${accent}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: accent,
          }}
        />
      </div>

      {/* Divider line */}
      {!isLast && (
        <div
          className="guide-step-divider"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '80px',
            right: '60px',
            height: '1px',
            background: 'linear-gradient(to right, #e2e8f0, transparent)',
          }}
        />
      )}
    </div>
  );
});

function Index() {
  const { t } = useTranslation();
  const [from, setFrom] = useState('นครราชสีมา');
  const [to, setTo] = useState('');
  const [time, setTime] = useState('');
  const [locations, setLocations] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const navigate = useNavigate();

  const guideSectionRef = useRef(null);
  const guideHeaderRef = useRef(null);
  const stepRefs = useRef([]);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase.from('bus_routes').select('route_name_th, route_name_en');
        if (error) throw error;

        if (data) {
          const locMap = new Map();

          data.forEach(r => {
            const thParts = (r.route_name_th || '').split(/\s*[-–—_:|]\s*/).map(s => s.trim()).filter(Boolean);
            const enParts = (r.route_name_en || '').split(/\s*[-–—_:|]\s*/).map(s => s.trim()).filter(Boolean);

            if (thParts.length >= 2) {
              const originTh = thParts[0];
              const destTh = thParts[thParts.length - 1];
              const originEn = enParts.length >= 2 ? enParts[0] : '';
              const destEn = enParts.length >= 2 ? enParts[enParts.length - 1] : '';

              if (!locMap.has(originTh)) {
                locMap.set(originTh, {
                  value: originTh,
                  enValue: originEn,
                  searchString: `${originTh} ${originEn}`.toLowerCase()
                });
              }
              if (!locMap.has(destTh)) {
                locMap.set(destTh, {
                  value: destTh,
                  enValue: destEn,
                  searchString: `${destTh} ${destEn}`.toLowerCase()
                });
              }
            } else if (r.route_name_th) {
              if (!locMap.has(r.route_name_th)) {
                locMap.set(r.route_name_th, {
                  value: r.route_name_th,
                  enValue: r.route_name_en || '',
                  searchString: `${r.route_name_th} ${r.route_name_en || ''}`.toLowerCase()
                });
              }
            }
          });

          const sortedLocs = Array.from(locMap.values()).sort((a, b) => a.value.localeCompare(b.value));

          if (sortedLocs.length === 0) {
            setLocations([
              { value: 'นครราชสีมา', enValue: 'Nakhon Ratchasima', searchString: 'นครราชสีมา nakhon ratchasima' },
              { value: 'กรุงเทพฯ', enValue: 'Bangkok', searchString: 'กรุงเทพฯ bangkok' },
              { value: 'ปากช่อง', enValue: 'Pak Chong', searchString: 'ปากช่อง pak chong' }
            ]);
          } else {
            setLocations(sortedLocs);
          }
        }
      } catch (err) {
        console.error("Failed to load locations for autocomplete", err);
        setLocations([
          { value: 'นครราชสีมา', enValue: 'Nakhon Ratchasima', searchString: 'นครราชสีมา nakhon ratchasima' },
          { value: 'กรุงเทพฯ', enValue: 'Bangkok', searchString: 'กรุงเทพฯ bangkok' },
          { value: 'ปากช่อง', enValue: 'Pak Chong', searchString: 'ปากช่อง pak chong' }
        ]);
      }
    };

    fetchLocations();
  }, []);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = () => {
    if (from && to) {
      navigate(`/route-information?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`);
    } else {
      navigate('/route-information');
    }
  };

  const steps = [
    {
      step: '01',
      title: t('guidebook.steps.0.title'),
      desc: t('guidebook.steps.0.desc'),
      icon: FiMapPin,
    },
    {
      step: '02',
      title: t('guidebook.steps.1.title'),
      desc: t('guidebook.steps.1.desc'),
      icon: FaBus,
    },
    {
      step: '03',
      title: t('guidebook.steps.2.title'),
      desc: t('guidebook.steps.2.desc'),
      icon: FiCheckCircle,
    },
  ];

  // ── GSAP ScrollTrigger animations ──
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Header entrance
      if (guideHeaderRef.current) {
        const headerEls = guideHeaderRef.current.children;
        gsap.fromTo(headerEls,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: guideHeaderRef.current,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Each step panel
      stepRefs.current.forEach((el, i) => {
        if (!el) return;

        const number = el.querySelector('.guide-step-number');
        const body = el.querySelector('.guide-step-body');
        const ring = el.querySelector('.guide-step-ring');
        const divider = el.querySelector('.guide-step-divider');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
            onEnter: () => setActiveStep(i),
            onEnterBack: () => setActiveStep(i),
          },
        });

        tl.fromTo(number,
          { x: -80, opacity: 0, scale: 0.6 },
          { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
        );
        tl.fromTo(body.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
          '-=0.4'
        );

        if (ring) {
          tl.fromTo(ring,
            { scale: 0, rotation: -90, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' },
            '-=0.4'
          );
        }

        if (divider) {
          tl.fromTo(divider,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.3'
          );
        }
      });

      // Progress bar
      if (progressBarRef.current && guideSectionRef.current) {
        gsap.fromTo(progressBarRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: guideSectionRef.current,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 0.3,
            },
          }
        );
      }

    }, guideSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">

      {/* Hero Section with Background */}
      <div
        className="relative w-full h-[60vh] min-h-[400px] flex flex-col items-center justify-end pb-24 md:pb-20"
        style={{
          backgroundImage: 'url("/src/assets/bg-bks.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 80%',
        }}
      >
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-0"></div>

        {/* Hero Text aligned with container */}
        <div className="relative z-10 w-full max-w-6xl px-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight mb-2 text-center md:text-left">
            {t('hero.headline')}
          </h1>
          <p className="text-xl md:text-xl text-gray-200 font-medium drop-shadow-md text-center md:text-left">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Overlapping Booking Container */}
      <div className="relative z-20 w-full max-w-6xl px-4 mx-auto -mt-16 md:-mt-12">
        <div className="w-full bg-white rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-4 md:p-6 flex flex-col border border-gray-100">

          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-stretch w-full relative z-30">

            {/* From Input with Autocomplete */}
            <AutocompleteInput
              value={from}
              onChange={setFrom}
              placeholder={t('hero.from')}
              icon={FiMapPin}
              locations={locations}
              isOrigin={true}
            />

            {/* Swap Button */}
            <div className="hidden lg:flex items-center justify-center">
              <button
                onClick={handleSwap}
                className="p-3 text-gray-400 hover:bg-[#ffe4eb] rounded-full transition-colors shadow-sm border border-gray-200 bg-white cursor-pointer"
                title="Swap locations"
              >
                <FaExchangeAlt size={16} />
              </button>
            </div>

            {/* To Input with Autocomplete */}
            <AutocompleteInput
              value={to}
              onChange={setTo}
              placeholder={t('hero.to')}
              icon={FiMapPin}
              locations={locations}
              isOrigin={false}
            />

            {/* Time Input */}
            <div className="w-full lg:w-64 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400 group-focus-within:text-pink-500 group-focus-within:scale-110 transition-transform" size={20} />
              </div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 py-4 text-gray-800 focus:outline-none focus:bg-white transition-all font-medium text-lg h-full cursor-pointer"
              />
            </div>

            {/* Find Tickets Button */}
            <div className="w-full lg:w-auto flex items-stretch mt-2 lg:mt-0">
              <button
                onClick={handleSearch}
                className="w-full lg:w-auto px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white font-black text-xl rounded-lg shadow-md transition-all uppercase tracking-wider transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer">
                {t('hero.search')}
              </button>
            </div>

          </div>
        </div>
      </div>

      <Guidebook />
      

    </div>
  );
}

export default Index;
