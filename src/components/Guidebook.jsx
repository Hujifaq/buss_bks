import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useTranslation } from 'react-i18next';
import tuto1 from '../assets/tuto1.png';
import tuto2 from '../assets/tuto2.png';
import tuto3 from '../assets/tuto3.png';
import tuto4 from '../assets/tuto4.png';

const Guidebook = () => {
  const { t } = useTranslation();

  const tutorialSteps = [
    { img: tuto1 },
    { img: tuto2 },
    { img: tuto3 },
    { img: tuto4 },
  ];

  return (
    <section className="w-full bg-[#fafafa] pt-24 pb-32 overflow-hidden">
      {/* Header Area */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-16 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1e1b4b] tracking-tight shrink-0">
          {t('guidebook.title')}
        </h2>
        
        <p className="max-w-2xl text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
          {t('guidebook.subtitle')}
        </p>
      </div>

      {/* Swiper Slider Area */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <Swiper
          spaceBetween={30}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 2.5 },
            1280: { slidesPerView: 3 }
          }}
          className="w-full pb-12 !overflow-visible"
        >
          {tutorialSteps.map((step, index) => (
            <SwiperSlide key={index}>
              <div className="group relative w-full aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden cursor-pointer">
                
                {/* Image Placeholder - You can add <img> tags here later */}
                <img src={step.img} alt={step.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Text Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-left drop-shadow-lg transition-transform duration-500 ease-out group-hover:-translate-y-2">
                    {t(`guidebook.steps.${index}.title`)}
                  </h3>
                  
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                    <div className="overflow-hidden">
                      <p className="text-gray-200 text-sm md:text-base text-left pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                        {t(`guidebook.steps.${index}.desc`)}
                      </p>
                    </div>
                  </div>
                </div>
                
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Guidebook;