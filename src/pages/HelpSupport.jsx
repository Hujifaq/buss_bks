import React from 'react';
import { FiPhoneCall, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

function HelpSupport() {
  const { t } = useTranslation();

  const contacts = [
    {
      pageName: 'สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่ 2',
      phone: '044 256 008',
      tel: 'tel:044256008',
    },
    {
      pageName: 'สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่ 1 เทศบาลนครนครราชสีมา',
      phone: '044 242 899',
      tel: 'tel:044242899',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Single Unified Page Container */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col gap-8">

          {/* Header Title */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3.5">
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
              </div>
            </div>
          </div>

          {/* Contact List */}
          <div className="flex flex-col gap-4">
            <div className="divide-y divide-gray-100">
              {contacts.map((item, index) => (
                <div key={index} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <FiMapPin size={20} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-500">
                        {t('help.pageNameLabel', 'ชื่อเพจ:')}
                      </span>
                      <span className="text-base font-bold text-[#241D4F] leading-snug">
                        {item.pageName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-13 sm:pl-0">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-xs font-semibold text-gray-500">
                        {t('help.contactNumberLabel', 'เบอร์ติดต่อ:')}
                      </span>
                      <a
                        href={item.tel}
                        className="inline-flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] cursor-pointer whitespace-nowrap"
                      >
                        <FiPhoneCall size={16} />
                        <span>{item.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default HelpSupport;

