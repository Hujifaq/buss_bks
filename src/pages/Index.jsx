import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiCalendar, FiSearch, FiClock, FiCheckCircle } from 'react-icons/fi';
import { FaExchangeAlt, FaBus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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
      title: 'เลือกต้นทางและปลายทาง',
      desc: 'ระบุจุดเริ่มต้นและสถานที่ปลายทางที่ต้องการเดินทาง หรือเลือกจากรายการจุดจอดสถานีขนส่ง',
      icon: FiMapPin,
      badgeColor: 'bg-pink-50 text-pink-600 border-pink-100',
    },
    {
      step: '02',
      title: 'ค้นหาเส้นทางและตารางเวลา',
      desc: 'ตรวจสอบรอบเวลาเดินรถ ราคาค่าโดยสาร ประเภทรถ (รถทัวร์/รถตู้/สองแถว) และจุดแวะพักระหว่างทาง',
      icon: FaBus,
      badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      step: '03',
      title: 'ดูแผนที่และเริ่มเดินทาง',
      desc: 'ดูเส้นทางจำลองบนแผนที่เพื่อเตรียมตัวเดินทางไปยังสถานีขนส่งหรือจุดจอดได้อย่างแม่นยำ',
      icon: FiCheckCircle,
      badgeColor: 'bg-orange-50 text-orange-600 border-orange-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">

      {/* Hero Section with Background */}
      <div
        className="relative w-full h-[60vh] min-h-[400px] flex flex-col items-center justify-end pb-24 md:pb-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1572675339312-3e8b094a544d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-11 pr-4 py-4 text-gray-800 focus:outline-none focus:bg-white transition-all font-medium text-lg h-full cursor-pointer"
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

      {/* Quick Guide Section (วิธีการใช้งานฉบับย่อ) */}
      <div className="w-full bg-gray-50 flex flex-col items-center pt-20 pb-24 px-4 md:px-8 relative z-10">
        <div className="w-full max-w-6xl flex flex-col gap-10">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              User Guide
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#241D4F]">
              วิธีการใช้งานฉบับย่อ
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-lg">
              3 ขั้นตอนง่ายๆ ในการค้นหาข้อมูลและวางแผนการเดินทางด้วยรถโดยสาร บขส.
            </p>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-7 border border-gray-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4 relative overflow-hidden"
                >
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.badgeColor}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-3xl font-black text-gray-200 tracking-tighter">
                      {item.step}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}

export default Index;