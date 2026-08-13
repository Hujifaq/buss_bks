import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import { FaExchangeAlt } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const newsData = [
  {
    id: 1,
    title: "ขั้นตอนการจองตั๋ว BKS ผ่านช่องทางเว็บไซต์ ง่ายๆ จ่ายได้สะดวก สบาย",
    date: "09 มิถุนายน 2569 00:00 น.",
    image: "https://tcl99web.transport.co.th/file/download/?s=kn7eDDhCGNaBznjEHLyybGlvYb5nucXqYgxxDxmOwcjQEMgUrLshJ3ts2gDlh6V_Xfp2vjQcTLfTHoAruYFFwi4fWucYS0-XCholEV92sxSeKhctxB0Eu3nT0myfvDpvqj57TrrTsVduG4V965lXRstMev5MDQTlf_3BtuAt4RC9mXvhJsAPWdxK7q4vVR1TfGhd7LQVhjscrNd-lV7-BTyfjJpB9yVS1lvMFe42YIEwC8rBZca6bZLQUOdvH_HJ-mfGvmvrjcsN2elXy65S2jGWQnbhqHo%3D&ref=MNySeW_VrFl76B2G8Uj5iXjfWc82QxK3S6G9IiFdTyjWqFcpcdr-7TJsgZ_bHbE2og41_v0zVi54V4EHNeOB4a8jfo6WyBQq4uFJ",
    excerpt: "1.ขั้นตอนการจองตั๋ว เลือกรุปแบบการเดินทาง เลือกต้นทาง-ปลายทางที่ต้องการไป...",
    link: "https://tcl99web.transport.co.th/announce/announceSearch/announceDetail?newsId=145"
  },
  {
    id: 2,
    title: "ซื้อตั๋วโดยสารผ่านแอปพลิเคชัน 'BKS E-Ticket' รับส่วนลด 20%",
    date: "11 สิงหาคม 2569 00:00 น.",
    image: "https://tcl99web.transport.co.th/file/download/?s=X9ArinU9jpjm4WAR_-81EVgKtV5ekaoaSPV29_2FudisHoA_It2EKGGSwqyX7jT7UhFvcLkjxTTYLS3wsx8aelclyHsR0Tj1I6VVW5Q86uBxbgly2yVTqFunCYobWqVRJIp9PYOa0Wd8WZmeB9PAq6_zJ7lxCc3mSu3b19rjI0D9-0tuzmGqLlJIdOefdMLW2443rhLr01tUe4WNB6cCoPwjzJhBAwwqNIC4EQzp-n76dXrp3jVTBHwr3z2oqSdu8YmB3WAUy6MK_VKzRR7t3fNYkNIBI5n1Ga_c&ref=PabaKXXRkLW96a-yZXqAtbMXMoV4_XLfUuwyWagJfXNziXzEDDMCY2WiLewsqPjHJRDsXDlcsNt5z3m0YD6JMHpSUM_lSyz1QJ-sRA==",
    excerpt: "จองง่าย ประหยัดกว่า กับ BKS E-Ticket สำหรับเงื่อนไขการใช้สิทธิ์.....",
    link: "https://tcl99web.transport.co.th/announce/announceSearch/announceDetail?newsId=162"
  },
  {
    id: 3,
    title: "พาแม่เที่ยว พาแม่ช้อป เติมความสุขให้คนพิเศษ 'BKS' ส่งโปรสุดคุ้มต้อนรับ วันแม่",
    date: "07 สิงหาคม 2569 00:00 น.",
    image: "https://tcl99web.transport.co.th/file/download/?s=VhxGMM_V5FEBtlR-ArEgU3p_pZm9AD6NgLSMYqnjJtP2KrDiUCVCpfTy81nqtE81Kvf7XxABpPAitROaGTQGJfF8s1qgOguqxZ14_OUH3eUQcSxE4HrEWomaRxAtEemiKlzL7zUaIRDO33eCFsj0AtaevPhgUEsKxPkJ_JpyzuXjNq53oyjqcPuWfbrbBmq5HC3WMtpFuk5vOm4qS5zgNekIcIA-MqjoLmGBWsrXcNjadUWOW1igux-MeWSSSGhgxpMaUUk4_0l-QLCPyKGAB2GCHptGlac%3D&ref=x58KfW1GzH92g-Sktmu_Fr_VyJF7KWMuOqDBUuzjy2xkM_bvzhZK-F6TmxG87H5wa_miQlF5wO_d6LBj63kpzU6uzSecdVusM2Q4",
    excerpt: "เพียงซื้อตั๋วผ่านช่องทางออนไลน์ รับส่วนลดค่าโดยสาร 5% พร้อมรับแต้ม X2...",
    link: "https://tcl99web.transport.co.th/announce/announceSearch/announceDetail?newsId=161"
  }
];

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

function Index() {
  const [from, setFrom] = useState('นครราชสีมา');
  const [to, setTo] = useState('');
  const [time, setTime] = useState('');
  const [locations, setLocations] = useState([]);

  const navigate = useNavigate();

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
          
          // Sort alphabetically by Thai name
          const sortedLocs = Array.from(locMap.values()).sort((a, b) => a.value.localeCompare(b.value));
          console.log('[Index.jsx] Fetched distinct locations:', sortedLocs);
          
          if (sortedLocs.length === 0) {
             console.log('[Index.jsx] Fallback triggered due to empty parse');
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
            Where will your next journey begin?
          </h1>
          <p className="text-xl md:text-xl text-gray-200 font-medium drop-shadow-md text-center md:text-left">
            Find the best bus routes across Nakhon Ratchasima in seconds.
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
              placeholder="Origin" 
              icon={FiMapPin} 
              locations={locations}
              isOrigin={true}
            />

            {/* Swap Button */}
            <div className="hidden lg:flex items-center justify-center">
              <button
                onClick={handleSwap}
                className="p-3 text-gray-400  hover:bg-[#ffe4eb] rounded-full transition-colors shadow-sm border border-gray-200 bg-white cursor-pointer"
                title="Swap locations"
              >
                <FaExchangeAlt size={16} />
              </button>
            </div>

            {/* To Input with Autocomplete */}
            <AutocompleteInput 
              value={to} 
              onChange={setTo} 
              placeholder="Destination" 
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
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 py-4 text-gray-800 focus:outline-none  focus:bg-white transition-all font-medium text-lg h-full cursor-pointer"
              />
            </div>

            {/* Find Tickets Button */}
            <div className="w-full lg:w-auto flex items-stretch mt-2 lg:mt-0">
              <button 
                onClick={handleSearch}
                className="w-full lg:w-auto px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white font-black text-xl rounded-lg shadow-md transition-all uppercase tracking-wider transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer">
                Search
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* News Section using Swiper */}
      <div className="w-full bg-gray-50 flex flex-col items-center pt-24 pb-24 px-4 md:px-8 relative z-10">
        <div className="w-full max-w-6xl flex flex-col gap-8">
          <div className="flex justify-between items-end border-b border-gray-200 pb-4">
            <h2 className="text-3xl md:text-4xl font-black text-[#241D4F]">Latest News</h2>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full pb-16 pt-2"
            style={{
              '--swiper-pagination-color': '#ec4899', 
              '--swiper-pagination-bullet-inactive-color': '#d1d5db',
              '--swiper-pagination-bullet-inactive-opacity': '0.5'
            }}
          >
            {newsData.map(news => (
              <SwiperSlide key={news.id} className="h-auto">
                <a href={news.link} className="bg-white rounded-2xl w-full border border-gray-100 overflow-hidden h-full flex flex-col my-6 cursor-pointer block hover:scale-102 transition-all duration-200">
                  <div className="h-52 w-full overflow-hidden relative">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-[#241D4F] mb-3 leading-snug line-clamp-2">{news.title}</h3>
                    <p className="text-gray-500 line-clamp-3 text-sm flex-1 font-medium mb-4">{news.excerpt}</p>

                    <div className="flex items-center gap-2 mt-auto">
                      <div className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px]">
                        L
                      </div>
                      <span className="text-xs font-medium text-gray-400">{news.date}</span>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

    </div>
  );
}

export default Index;