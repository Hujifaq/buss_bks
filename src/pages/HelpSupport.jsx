import React, { useState } from 'react';
import { FiPhoneCall, FiExternalLink, FiHelpCircle, FiChevronDown, FiGlobe, FiMapPin, FiShield, FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const BKS_CONTACT_URL = 'https://tcl99web.transport.co.th/contact-us/index';

function HelpSupport() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { t } = useTranslation();

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = t('help.faqs', { returnObjects: true });

  return (
    <div className="w-full min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Single Unified Page Container (Thai-Style Layout) */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col gap-8">
          
          {/* Header Title with Stylish BKS Brand Badge */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3.5">
              {/* Stylish Brand Logo Avatar Badge */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-md flex items-center justify-center">
                <img
                  src="/src/assets/logo_bks.png"
                  alt="BKS Express Logo"
                  className="w-full h-full object-contain bg-white rounded-[14px] p-1"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-black text-[#241D4F] tracking-tight">
                  {t('help.title')}
                </h1>
                <span className="text-xs font-bold text-pink-600 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t('help.subtitle')}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Official BKS Contact Portal */}
          <div className="flex flex-col gap-3 pb-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-pink-50/80 to-rose-50/40 p-5 rounded-2xl border border-pink-100">
              <div className="flex items-center gap-3.5">
                {/* Official BKS Portal Brand Icon */}
                <div className="w-11 h-11 rounded-2xl bg-white border border-pink-200 p-1 flex items-center justify-center shadow-sm flex-shrink-0">
                  <img
                    src="/src/assets/logo_bks.png"
                    alt="BKS"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-[#241D4F]">
                    {t('help.bksPortal')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t('help.bksPortalDesc')}
                  </span>
                </div>
              </div>

              <a
                href={BKS_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#241D4F] hover:bg-[#1a143b] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] cursor-pointer whitespace-nowrap"
              >
                <FiGlobe size={14} className="text-pink-400" />
                <span>{t('help.goToWebsite')}</span>
                <FiExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Section 2: Hotlines */}
          <div className="flex flex-col gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                <FiPhoneCall size={16} />
              </div>
              <h2 className="text-base font-bold text-[#241D4F]">
                {t('help.hotline')}
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {/* Row 1: Call Center */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">
                    {t('help.callCenter')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t('help.callCenterDesc')}
                  </span>
                </div>

                <a
                  href="tel:1490"
                  className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-[#241D4F] font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FiPhoneCall size={13} className="text-pink-500" />
                  <span>{t('help.callBtn')} 1490</span>
                </a>
              </div>

              {/* Row 2: Headquarters */}
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">
                    {t('help.hq')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {t('help.hqDesc')}
                  </span>
                </div>

                <a
                  href="tel:029362852"
                  className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-[#241D4F] font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FiPhoneCall size={13} className="text-pink-500" />
                  <span>{t('help.callOut')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Bus Terminals Phone Directory */}
          <div className="flex flex-col gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#241D4F] flex items-center justify-center flex-shrink-0">
                <FiMapPin size={16} />
              </div>
              <h2 className="text-base font-bold text-[#241D4F]">
                {t('help.terminalsTitle')}
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {[
                { name: t('help.terminals.0.name'), phone: '044-242-899', tel: 'tel:044242899' },
                { name: t('help.terminals.1.name'), phone: '044-256-006', tel: 'tel:044256006' },
                { name: t('help.terminals.2.name'), phone: '02-936-2841', tel: 'tel:029362841' },
              ].map((item) => (
                <div key={item.name} className="py-3 flex items-center justify-between gap-4">
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <a
                    href={item.tel}
                    className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 whitespace-nowrap"
                  >
                    <FiPhoneCall size={13} />
                    <span>{item.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: FAQs */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <FiHelpCircle size={16} />
              </div>
              <h2 className="text-base font-bold text-[#241D4F]">
                {t('help.faqTitle')}
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="py-2.5">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left py-2 flex items-center justify-between gap-3 cursor-pointer text-xs sm:text-sm font-bold text-gray-900 hover:text-pink-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <FiChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pt-2 pb-1 text-xs text-gray-600 leading-relaxed font-normal">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default HelpSupport;
