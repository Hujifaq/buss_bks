import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FiSearch, FiX, FiChevronDown, FiMapPin, FiClock, FiNavigation, FiArrowRight, FiCheck } from 'react-icons/fi';
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [routesData, setRoutesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState('all');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync URL search param changes with local state
  useEffect(() => {
    const qFromUrl = searchParams.get('q') || '';
    setSearchQuery(qFromUrl);
  }, [searchParams]);

  // Handle input search change and URL query string update
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  // Close origin dropdown when clicking outside
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
        console.error('Error fetching bus routes from Supabase:', err);
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

  // Format and process routes into card view objects
  const processedRoutes = useMemo(() => {
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
      let vehicleBadge = 'Bus (รถทัวร์)';
      let vType = route.vehicle_type || 'bus';
      
      if (vType === 'minibus') {
        vehicleBadge = 'Minibus (รถสองแถว)';
      } else if (vType === 'van') {
        vehicleBadge = 'Van (รถตู้)';
      } else if (route.fare_aircon_min_baht || route.fare_aircon_max_baht) {
        vehicleBadge = 'AC (ปรับอากาศ)';
      } else if (route.fare_fan_min_baht || route.fare_fan_max_baht) {
        vehicleBadge = 'Fan (พัดลม)';
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
        ...route,
        id: route.route_id || index,
        routeCode: route.route_code || `${index + 1}`,
        title: thName || enName || `สาย ${route.route_code || ''}`,
        origin: originName,
        destination: destName,
        stopName: `จุดจอด: ${originName}`,
        vehicleTypeBadge: vehicleBadge,
        vType,
        timeRange: route.departure_time_range_raw || '06.00 - 17.00 น.',
        fare: fareDisplay,
        photo: photoUrl,
        company: route.company_name || 'BKS Transport',
        stopsVia: route.stops_via || '',
      };
    });
  }, [routesData]);

  // Multi-field search & category filtering
  const filteredRoutes = useMemo(() => {
    let result = processedRoutes;

    // Filter by Origin Dropdown
    if (selectedOrigin && selectedOrigin !== 'All Origins') {
      result = result.filter((item) => item.origin.toLowerCase().includes(selectedOrigin.toLowerCase()));
    }

    // Filter by Vehicle Type Pill
    if (selectedVehicleFilter !== 'all') {
      result = result.filter((item) => {
        if (selectedVehicleFilter === 'van') return item.vType === 'van';
        if (selectedVehicleFilter === 'minibus') return item.vType === 'minibus';
        if (selectedVehicleFilter === 'bus') return item.vType === 'bus' || item.vType === 'express' || (!item.vType);
        return true;
      });
    }

    // Filter by Search Query Text
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const matchesCode = item.routeCode.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesOrigin = item.origin.toLowerCase().includes(q);
        const matchesDest = item.destination.toLowerCase().includes(q);
        const matchesStops = item.stopsVia.toLowerCase().includes(q);
        const matchesCompany = item.company.toLowerCase().includes(q);

        return matchesCode || matchesTitle || matchesOrigin || matchesDest || matchesStops || matchesCompany;
      });
    }

    return result;
  }, [processedRoutes, selectedOrigin, selectedVehicleFilter, searchQuery]);

  const handleSelectRoute = (route) => {
    navigate(`/route-information?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}`);
  };

  const handleResetFilters = () => {
    handleSearchChange('');
    setSelectedOrigin('');
    setSelectedVehicleFilter('all');
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-white p-6">
        <MoonLoader color="#374151" size={40} />
        <span className="text-sm font-semibold text-gray-600">Loading Bus Stops & Routes...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Global Prominent Search & Control Header */}
        <div className="flex flex-col gap-3.5">
          <div className="w-full bg-white rounded-2xl p-2 flex items-center gap-2 border border-gray-300 shadow-sm focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-300 transition-all relative">
            
            {/* Left: "Start At" Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
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

            {/* Center: Search Input */}
            <FiSearch size={20} className="text-gray-400 ml-1 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by bus stop, route number, destination, or company..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm md:text-base font-normal outline-none py-1"
            />

            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                title="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {/* Vehicle Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Vehicles' },
              { id: 'minibus', label: 'Minibus (รถสองแถว)' },
              { id: 'van', label: 'Van (รถตู้)' },
              { id: 'bus', label: 'Bus (รถทัวร์)' },
            ].map((filter) => {
              const isSelected = selectedVehicleFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedVehicleFilter(filter.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Header Results Info */}
        <div className="flex items-center justify-between px-1 mt-2">
          <h1 className="text-base font-bold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Bus Stops & Available Routes'}
          </h1>
          <span className="text-xs font-medium text-gray-500">
            {filteredRoutes.length} {filteredRoutes.length === 1 ? 'route' : 'routes'} found
          </span>
        </div>

        {/* Content Grid */}
        {filteredRoutes.length === 0 ? (
          <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
            <FaBus size={36} className="text-gray-300" />
            <h3 className="text-base font-bold text-gray-800">No matching routes or bus stops found</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Try checking your search spelling, choosing a different origin, or selecting all vehicle types.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 text-xs font-semibold text-gray-900 underline cursor-pointer hover:text-pink-600 transition-colors"
            >
              Reset filters and view all routes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoutes.map((card) => (
              <div
                key={card.id}
                onClick={() => handleSelectRoute(card)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col group"
              >
                {/* Photo Area */}
                <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                  <img
                    src={card.photo}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-800 text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                    {card.vehicleTypeBadge}
                  </span>
                  {card.route_code && (
                    <span className="absolute bottom-3 left-3 bg-[#241D4F] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      Line {card.routeCode}
                    </span>
                  )}
                </div>

                {/* Card Text Details */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                    <span>{card.stopName}</span>
                    <span className="text-gray-400 font-normal">{card.company}</span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-pink-600 transition-colors">
                    {card.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-normal">
                    <FiMapPin size={13} className="text-gray-400 flex-shrink-0" />
                    <span>{card.origin}</span>
                    <FiArrowRight size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800 line-clamp-1">{card.destination}</span>
                  </div>

                  {/* Via Stops indicator if available */}
                  {card.stopsVia && (
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 mt-1">
                      <FiNavigation size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="line-clamp-1">Stops: {card.stopsVia}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2.5 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-1">
                      <FiClock size={12} className="text-gray-400" />
                      <span>{card.timeRange}</span>
                    </div>

                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <span>{card.fare}</span>
                      <FiArrowRight size={13} className="text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all ml-1" />
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