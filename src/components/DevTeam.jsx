import React from 'react';
import { useTranslation } from 'react-i18next';
import BlurText from './BlurText';

const DevTeam = () => {
  const { t } = useTranslation();
  
  // Use a fallback to empty array if translations aren't loaded yet
  const members = t('devTeam.members', { returnObjects: true }) || [];
  
  // Fallback data in case the translation returns a string instead of an array (safety check)
  const safeMembers = Array.isArray(members) ? members : [
    { role: 'ENGINEER', desc: '...', contact: '@kmutt' },
    { role: 'ENGINEER', desc: '...', contact: '@kmutt' },
    { role: 'ENGINEER', desc: 'kadsan.supp@kmutt.ac.th', contact: '@kmutt' },
    { role: 'ENGINEER', desc: '...', contact: '@kmutt' },
  ];

  // Brand-aligned colors for the circle badges
  const badgeColors = [
    'bg-pink-500', 
    'bg-purple-500', 
    'bg-rose-400',
    'bg-[#241D4F]' // The dark blue brand color
  ];

  // Placeholder images (Unsplash)
  const images = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop'
  ];

  return (
    <section className="w-full bg-white pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Header */}
        <div className="mb-20 max-w-3xl">
          <BlurText
            text={t('devTeam.title', 'The Developers')}
            delay={150}
            animateBy="words"
            direction="top"
            className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1e1b4b] tracking-tight mb-6"
          />
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
            {t('devTeam.subtitle', 'Built proudly by a dedicated team of students from KMUTT.')}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {safeMembers.map((member, index) => (
            <div key={index} className="flex flex-col group">
              
              {/* Image & Badge Container */}
              <div className="relative mb-8 pt-8 pr-8">
                
                {/* Rectangular Image Container */}
                <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden shadow-sm border border-gray-100">
                  <img 
                    src={images[index]} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-105"
                  />
                </div>

               
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-grow">
                <h4 className="text-xs sm:text-sm font-black text-gray-500 tracking-[0.15em] uppercase mb-4">
                  {member.role}
                </h4>
                
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 flex-grow">
                  {member.desc}
                </p>
                
                <a href={`mailto:${member.contact}`} className="text-[#1e1b4b] font-bold text-sm hover:text-pink-500 transition-colors">
                  {member.contact}
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevTeam;
