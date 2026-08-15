import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollExpand from './ScrollExpand';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.reveal-about', {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        stagger: 0.25,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        }
      });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-white pt-16 pb-24 border-t border-gray-100">
      
      {/* Header Area */}
      <div ref={headerRef} className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-12 flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-8 md:gap-16">
        <div className="flex-1 md:text-right overflow-hidden pb-2">
          <h2 className="reveal-about text-4xl md:text-5xl lg:text-6xl font-black text-[#1e1b4b] tracking-tight translate-y-full opacity-0">
            {t('about.badge')}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden pb-2">
          <p className="reveal-about text-gray-600 text-lg leading-relaxed font-medium translate-y-full opacity-0">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* ScrollExpand Section for "What is this site?" */}
      <ScrollExpand
        src="https://apywlcxidcnpbqmectgn.supabase.co/storage/v1/object/sign/Public/bg_2.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YTVlNjRlNS1mODdhLTRmMjMtODA1OC1mNTNiYWJmYzk5ODciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWJsaWMvYmdfMi5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2Njk3MTM1LCJleHAiOjE4MTgyMzMxMzV9.DSTtBG6jEWWcfYIx9rclRI8n-w50Z0-ARCCWt847Xo4"
        alt="Bus journey"
        title={t('about.mission.title')}
        scrollHint="Scroll to expand"
        scrollDistance={0.6}
        startWidth={isMobile ? 90 : 42}
        startHeight={isMobile ? 70 : 58}
        useWindowScroll
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-xl tracking-tight">
            {t('about.mission.title')}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium drop-shadow-lg text-center">
            {t('about.mission.desc')}
          </p>
        </div>
      </ScrollExpand>

    </section>
  );
};

export default AboutUs;
