import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FiSearch, FiX, FiMapPin, FiClock, FiNavigation, FiTag, FiArrowRight, FiCheck } from 'react-icons/fi';
import { FaBus } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';

function SearchRoutes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch routes from Supabase
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('bus_routes').select('*');
        if (error) throw error;
        if (data) {
          setRoutes(data);
        }
      } catch (err) {
        console.error('Error fetching routes for search:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Sync search input with URL params
  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  // Perform multi-field search and category filtering
  const filteredResults = useMemo(() => {
    if (!routes || routes.length === 0) return [];

    let result = routes.map((r) => {
      const thName = r.route_name_th || '';
      const enName = r.route_name_en || '';
      const parts = thName.split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);
      
      const origin = parts[0] || 'นครราชสีมา';
      const destination = parts[parts.length - 1] || enName || 'ปลายทาง';

      // Parse vehicle badge
      let vehicleLabel = 'Bus (รถทัวร์)';
      if (r.vehicle_type === 'minibus') vehicleLabel = 'Minibus (รถสองแถว)';
      else if (r.vehicle_type === 'van') vehicleLabel = 'Van (รถตู้)';
      else if (r.fare_aircon_min_baht) vehicleLabel = 'AC (ปรับอากาศ)';
      else if (r.fare_fan_min_baht) vehicleLabel = 'Fan (พัดลม)';

      // Parse fare text
      let fareText = '฿15 - ฿35';
      if (r.fare_baht) fareText = `฿${r.fare_baht}`;
      else if (r.fare_fan_min_baht) fareText = `฿${r.fare_fan_min_baht}${r.fare_fan_max_baht ? ` - ฿${r.fare_fan_max_baht}` : ''}`;
      else if (r.fare_aircon_min_baht) fareText = `฿${r.fare_aircon_min_baht}${r.fare_aircon_max_baht ? ` - ฿${r.fare_aircon_max_baht}` : ''}`;

      return {
        ...r,
        origin,
        destination,
        title: thName || enName || `สาย ${r.route_code || ''}`,
        vehicleLabel,
        fareText,
        timeRange: r.departure_time_range_raw || '06.00 - 17.00 น.',
      };
    });

    // Apply search filter if query is typed
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter((item) => {
        const matchesCode = item.route_code && item.route_code.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesOrigin = item.origin.toLowerCase().includes(q);
        const matchesDest = item.destination.toLowerCase().includes(q);
        const matchesStops = item.stops_via && item.stops_via.toLowerCase().includes(q);
        const matchesCompany = item.company_name && item.company_name.toLowerCase().includes(q);

        return matchesCode || matchesTitle || matchesOrigin || matchesDest || matchesStops || matchesCompany;
      });
    }

    // Apply category tag filter
    if (selectedFilter !== 'all') {
      result = result.filter((item) => {
        if (selectedFilter === 'van') return item.vehicle_type === 'van';
        if (selectedFilter === 'minibus') return item.vehicle_type === 'minibus';
        if (selectedFilter === 'bus') return item.vehicle_type === 'bus' || (!item.vehicle_type && !item.vehicle_type);
        return true;
      });
    }

    return result;
  }, [routes, query, selectedFilter]);

  const handleSelectRoute = (route) => {
    navigate(`/route-information?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Global Prominent Search Header */}
        <div className="flex flex-col gap-4">
          <div className="w-full bg-white border border-gray-300 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-300 transition-all">
            <FiSearch size={22} className="text-gray-400 ml-2 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search for route numbers, destinations, or bus stops..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-base font-normal outline-none py-1"
            />
            {query && (
              <button
                onClick={() => handleQueryChange('')}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                title="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Vehicles' },
              { id: 'minibus', label: 'Minibus (รถสองแถว)' },
              { id: 'van', label: 'Van (รถตู้)' },
              { id: 'bus', label: 'Bus (รถทัวร์)' },
            ].map((filter) => {
              const isSelected = selectedFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
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

        {/* Results Header Status */}
        <div className="flex items-center justify-between px-1">
          <h1 className="text-sm font-semibold text-gray-700">
            {query ? `Search results for "${query}"` : 'All Available Routes'}
          </h1>
          <span className="text-xs font-medium text-gray-500">
            {filteredResults.length} {filteredResults.length === 1 ? 'route' : 'routes'} found
          </span>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center gap-3">
            <MoonLoader color="#374151" size={36} />
            <span className="text-sm font-medium text-gray-600">Searching routes...</span>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-3">
            <FaBus size={32} className="text-gray-300" />
            <h3 className="text-base font-bold text-gray-800">No matching routes found</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Try checking your spelling or searching for a different destination or route number.
            </p>
            <button
              onClick={() => {
                handleQueryChange('');
                setSelectedFilter('all');
              }}
              className="mt-2 text-xs font-semibold text-gray-900 underline cursor-pointer"
            >
              Clear filters and view all routes
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {filteredResults.map((route) => (
              <div
                key={route.route_id}
                onClick={() => handleSelectRoute(route)}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-150 cursor-pointer flex flex-col gap-3 group"
              >
                {/* Top Row: Route Badge & Vehicle Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {route.route_code && (
                      <span className="bg-[#241D4F] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                        Line {route.route_code}
                      </span>
                    )}
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {route.category || 'Route'}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-gray-700 border border-gray-200 px-2.5 py-0.5 rounded-full">
                    {route.vehicleLabel}
                  </span>
                </div>

                {/* Title & Route Points */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {route.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-600 font-normal">
                    <FiMapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{route.origin}</span>
                    <FiArrowRight size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">{route.destination}</span>
                  </div>
                </div>

                {/* Stops Via (if available) */}
                {route.stops_via && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <FiNavigation size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="line-clamp-1 font-normal">
                      Stops: {route.stops_via}
                    </span>
                  </div>
                )}

                {/* Bottom Row: Timetable & Fare */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 mt-1">
                  <div className="flex items-center gap-1.5">
                    <FiClock size={13} className="text-gray-400" />
                    <span>{route.timeRange}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiArrowRight size={14} className="text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
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

export default SearchRoutes;
