import React from 'react';
import { useTranslation } from 'react-i18next';
import BlurText from './BlurText';

const DevTeam = () => {
  const { t } = useTranslation();
  
  // Use a fallback to empty array if translations aren't loaded yet
  const members = t('devTeam.members', { returnObjects: true }) || [];
  
  // Fallback data in case the translation returns a string instead of an array (safety check)
  const safeMembers = Array.isArray(members) ? members : [
    { name: 'DEV ONE', role: 'ENGINEER', desc: '...', contact: '@kmutt' },
    { name: 'DEV TWO', role: 'ENGINEER', desc: '...', contact: '@kmutt' },
    { name: 'DEV THREE', role: 'ENGINEER', desc: '...', contact: '@kmutt' },
    { name: 'DEV FOUR', role: 'ENGINEER', desc: '...', contact: '@kmutt' },
  ];

  // Placeholder images (Unsplash)
  const images = [
    'https://images.unsplash.com/photo-1740252117012-bb53ad05e370?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1740252117012-bb53ad05e370?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1740252117012-bb53ad05e370?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1740252117012-bb53ad05e370?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  return (
    <section className="w-full bg-white pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <BlurText
            text={t('devTeam.title', 'The Developers')}
            delay={150}
            animateBy="words"
            direction="top"
            className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1e1b4b] tracking-tight mb-4"
          />
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
            {t('devTeam.subtitle', 'Built proudly by a dedicated team of students from KMUTT.')}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {safeMembers.map((member, index) => (
            <div key={index} className="flex flex-col group">
              
              {/* Rectangular Image Container - Tightly Spaced */}
              <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden shadow-sm border border-gray-100 rounded-xl mb-3">
                <img 
                  src={images[index]} 
                  alt={member.name || `Developer ${index + 1}`}
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-105"
                />
              </div>

              {/* Text Content - Tightly Aligned with Image */}
              <div className="flex flex-col flex-grow">
                {/* Member Name (Tightly under image) */}
                {member.name && (
                  <h3 className="text-base sm:text-lg font-black text-[#1e1b4b] tracking-tight mb-0.5">
                    {member.name}
                  </h3>
                )}

                {/* Email Contact (Tightly under Name) */}
                <a 
                  href={`mailto:${member.contact}`} 
                  className="text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors mb-1.5 truncate"
                >
                  {member.contact}
                </a>

                {/* Member Role */}
                <h4 className="text-[11px] font-bold text-gray-400 tracking-[0.12em] uppercase mb-3">
                  {member.role}
                </h4>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                  {member.desc}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevTeam;
