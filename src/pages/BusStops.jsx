import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FiSearch, FiChevronDown, FiMapPin, FiClock, FiCheck } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';

// High-quality realistic transport vehicle fallback photos
const fallbackPhotos = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562620669-9820a232704a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1572675339312-3e8b094a544d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
];

function BusStops() {
  const [routesData, setRoutesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDestination, setSearchDestination] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Supabase route data
  useEffect(() => {
    const fetchBusRoutes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('bus_routes').select('*');
        if (error) throw error;
        if (data) {
          setRoutesData(data);
        }
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusRoutes();
  }, []);

  // Extract distinct origin stop options for dropdown
  const originOptions = useMemo(() => {
    const origins = new Set();
    origins.add('All Origins');

    routesData.forEach((r) => {
      if (r.route_name_th) {
        const parts = r.route_name_th.split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);
        if (parts.length > 0) origins.add(parts[0]);
      }
    });

    return Array.from(origins);
  }, [routesData]);

  // Process data into 6 realistic card items
  const cardsData = useMemo(() => {
    return routesData.map((route, index) => {
      const thName = route.route_name_th || '';
      const enName = route.route_name_en || '';
      const parts = thName.split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);
      
      const originName = parts[0] || 'นครราชสีมา';
      const destName = parts[parts.length - 1] || enName || 'ปลายทาง';

      // Photo selection (valid supabase photo URL or realistic fallback)
      let photoUrl = route.photo;
      if (!photoUrl || typeof photoUrl !== 'string' || !photoUrl.startsWith('http')) {
        photoUrl = fallbackPhotos[index % fallbackPhotos.length];
      }

      // Determine Vehicle Type (AC / Fan / Minibus / Van)
      let vehicleBadge = 'AC';
      if (route.fare_aircon_min_baht || route.fare_aircon_max_baht) {
        vehicleBadge = 'AC (ปรับอากาศ)';
      } else if (route.fare_fan_min_baht || route.fare_fan_max_baht) {
        vehicleBadge = 'Fan (พัดลม)';
      } else if (route.vehicle_type === 'minibus') {
        vehicleBadge = 'Minibus';
      } else if (route.vehicle_type === 'van') {
        vehicleBadge = 'Van (รถตู้)';
      }

      // Format fare
      let fareDisplay = '฿15 - ฿35';
      if (route.fare_baht) {
        fareDisplay = `฿${route.fare_baht}`;
      } else if (route.fare_fan_min_baht) {
        fareDisplay = `฿${route.fare_fan_min_baht}${route.fare_fan_max_baht ? ` - ฿${route.fare_fan_max_baht}` : ''}`;
      } else if (route.fare_aircon_min_baht) {
        fareDisplay = `฿${route.fare_aircon_min_baht}${route.fare_aircon_max_baht ? ` - ฿${route.fare_aircon_max_baht}` : ''}`;
      }

      return {
        id: route.route_id || index,
        routeCode: route.route_code || `${index + 1}`,
        title: thName || `สาย ${route.route_code || ''}`,
        origin: originName,
        destination: destName,
        stopName: `จุดจอด: ${originName}`,
        vehicleTypeBadge: vehicleBadge,
        timeRange: route.departure_time_range_raw || '06.00 - 17.00 น.',
        fare: fareDisplay,
        photo: photoUrl,
        company: route.company_name || 'BKS Transport',
      };
    });
  }, [routesData]);

  // Filter 6 slots according to dropdown & destination input
  const filteredCards = useMemo(() => {
    let result = cardsData;

    if (selectedOrigin && selectedOrigin !== 'All Origins') {
      result = result.filter((item) => item.origin.toLowerCase().includes(selectedOrigin.toLowerCase()));
    }

    if (searchDestination.trim()) {
      const q = searchDestination.toLowerCase();
      result = result.filter(
        (item) =>
          item.destination.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.routeCode.toLowerCase().includes(q) ||
          item.stopName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [cardsData, selectedOrigin, searchDestination]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-white p-6">
        <MoonLoader color="#374151" size={40} />
        <span className="text-sm font-semibold text-gray-600">Loading Bus Stops...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto flex flex-col">

        {/* Wireframe Header Search Bar */}
        <div className="w-full bg-[#E5E7EB] rounded-2xl p-2 flex items-center gap-2 border border-gray-300/80 shadow-sm relative">
          
          {/* Left: "Start At" Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#D1D5DB] hover:bg-[#C5C9D1] text-gray-900 text-sm font-medium px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{selectedOrigin && selectedOrigin !== 'All Origins' ? selectedOrigin : 'Start At'}</span>
              <FiChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu List */}
            {isDropdownOpen && (
              <div className="absolute top-12 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg w-52 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-150">
                {originOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedOrigin(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer ${
                      (selectedOrigin === option || (!selectedOrigin && option === 'All Origins'))
                        ? 'font-bold text-gray-900 bg-gray-50'
                        : 'text-gray-700'
                    }`}
                  >
                    <span>{option}</span>
                    {(selectedOrigin === option || (!selectedOrigin && option === 'All Origins')) && (
                      <FiCheck size={16} className="text-gray-800" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: "Where are you going?" Text Input */}
          <input
            type="text"
            value={searchDestination}
            onChange={(e) => setSearchDestination(e.target.value)}
            placeholder="Where are you going?"
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 text-sm font-normal outline-none px-2 py-1"
          />

          {/* Right: Search Icon */}
          <button className="p-2 text-gray-700 hover:text-black transition-colors cursor-pointer">
            <FiSearch size={22} />
          </button>
        </div>

        {/* Section Title */}
        <h2 className="text-base font-semibold text-gray-800 mt-6 mb-4 px-1">
          Top Search
        </h2>

        {/* 3x2 Content Grid (6 Cards) */}
        {filteredCards.length === 0 ? (
          <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-2">
            <FaBus size={32} className="text-gray-300" />
            <p className="text-sm font-semibold text-gray-700">No routes or bus stops found matching your search.</p>
            <button
              onClick={() => {
                setSelectedOrigin('');
                setSearchDestination('');
              }}
              className="mt-2 text-xs font-semibold text-gray-900 underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCards.slice(0, 6).map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
              >
                {/* Photo Area */}
                <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                  <img
                    src={card.photo}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-800 text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                    {card.vehicleTypeBadge}
                  </span>
                </div>

                {/* Card Text Details */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      {card.stopName}
                    </span>
                    <span className="text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                      Line {card.routeCode}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                    {card.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-gray-600 font-normal">
                    <FiMapPin size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-1">Dest: {card.destination}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-1">
                      <FiClock size={12} className="text-gray-400" />
                      <span>{card.timeRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default BusStops;