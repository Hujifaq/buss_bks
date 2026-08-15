import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { FiSearch, FiX, FiChevronDown, FiMapPin, FiClock, FiNavigation, FiArrowRight, FiCheck, FiDollarSign } from 'react-icons/fi';
import { FaBus, FaBuilding } from 'react-icons/fa';
import { MoonLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [routesData, setRoutesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('');
  const [modalRoute, setModalRoute] = useState(null);

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

  // Format and process routes into card view objects
  const processedRoutes = useMemo(() => {
    return routesData.map((route, index) => {
      const thName = route.route_name_th || '';
      const enName = route.route_name_en || '';

      const thParts = thName.split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);
      const enParts = enName.split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);

      const isEn = i18n.language === 'en';

      const originTh = thParts[0] || 'นครราชสีมา';
      const destTh = thParts[thParts.length - 1] || 'ปลายทาง';

      const originEn = enParts[0] || originTh;
      const destEn = enParts[enParts.length - 1] || destTh;

      const originName = isEn ? originEn : originTh;
      const destName = isEn ? destEn : destTh;

      // Photo selection (valid supabase photo URL or realistic fallback)
      let photoUrl = route.photo;
      if (!photoUrl || typeof photoUrl !== 'string' || !photoUrl.startsWith('http')) {
        photoUrl = fallbackPhotos[index % fallbackPhotos.length];
      }

      // Determine Vehicle Type (AC / Fan / Minibus / Van)
      let vehicleBadge = t('ri.vehicleBus');
      let vType = route.vehicle_type || 'bus';
      
      if (vType === 'minibus') {
        vehicleBadge = t('ri.vehicleMinibus');
      } else if (vType === 'van') {
        vehicleBadge = t('ri.vehicleVan');
      } else if (route.fare_aircon_min_baht || route.fare_aircon_max_baht) {
        vehicleBadge = t('ri.vehicleAc');
      } else if (route.fare_fan_min_baht || route.fare_fan_max_baht) {
        vehicleBadge = t('ri.vehicleFan');
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
        title: (isEn && enName) ? enName : thName || enName || `${t('busStops.card.line')} ${route.route_code || ''}`,
        origin: originName,
        destination: destName,
        originTh,
        destTh,
        stopName: `${t('busStops.card.stop')} ${originName}`,
        vehicleTypeBadge: vehicleBadge,
        vType,
        timeRange: route.departure_time_range_raw || '06.00 - 17.00',
        fare: fareDisplay,
        photo: photoUrl,
        company: route.company_name || 'BKS Transport',
        stopsVia: route.stops_via || '',
      };
    });
  }, [routesData, t, i18n.language]);

  // Multi-field search & category filtering
  const filteredRoutes = useMemo(() => {
    let result = processedRoutes;

    // Filter by Vehicle Type Pill
    if (selectedVehicleFilter !== 'all') {
      result = result.filter((item) => {
        if (selectedVehicleFilter === 'ac') {
          return (
            item.vType === 'ac' ||
            item.vehicleTypeBadge?.toLowerCase().includes('ac') ||
            item.vehicleTypeBadge?.includes('แอร์') ||
            item.fare_aircon_min_baht ||
            item.fare_aircon_max_baht
          );
        }
        if (selectedVehicleFilter === 'van') return item.vType === 'van';
        if (selectedVehicleFilter === 'minibus') return item.vType === 'minibus';
        if (selectedVehicleFilter === 'bus') return item.vType === 'bus' || item.vType === 'express' || (!item.vType);
        return true;
      });
    }

    // Filter by Selected Operating Time Shift (Morning / Afternoon / Evening)
    if (selectedTimeFilter && selectedTimeFilter !== 'all') {
      result = result.filter((item) => {
        if (!item.timeRange) return true;
        const match = item.timeRange.match(/(\d{1,2})[.:](\d{2})\s*[-–—]\s*(\d{1,2})[.:](\d{2})/);
        if (!match) return true;

        const startMins = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
        const endMins = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);

        if (selectedTimeFilter === 'morning') {
          // Morning 05:00 - 12:00 (300 to 720 mins)
          return startMins <= 720 && endMins >= 300;
        } else if (selectedTimeFilter === 'afternoon') {
          // Afternoon 12:00 - 17:00 (720 to 1020 mins)
          return startMins <= 1020 && endMins >= 720;
        } else if (selectedTimeFilter === 'evening') {
          // Evening 17:00+ (>= 1020 mins)
          return endMins >= 1020;
        }
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
  }, [processedRoutes, selectedVehicleFilter, selectedTimeFilter, searchQuery]);

  const handleResetFilters = () => {
    handleSearchChange('');
    setSelectedVehicleFilter('all');
    setSelectedTimeFilter('all');
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
          <div className="w-full bg-white rounded-2xl p-2 md:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-gray-300 shadow-sm focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-300 transition-all relative">
            
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2">
              <FiSearch size={20} className="text-gray-400 ml-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('busStops.searchPlaceholder')}
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-sm md:text-base font-normal outline-none py-1"
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

            <div className="hidden sm:block w-[1px] h-6 bg-gray-200" />

            {/* Intuitive Time Shift Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200 transition-colors cursor-pointer">
              <FiClock size={16} className="text-gray-500 flex-shrink-0" />
              <select
                value={selectedTimeFilter || 'all'}
                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 outline-none cursor-pointer py-0.5"
              >
                <option value="all">ทุกช่วงเวลา</option>
                <option value="morning">รอบเช้า (05:00 - 12:00)</option>
                <option value="afternoon">รอบบ่าย (12:00 - 17:00)</option>
                <option value="evening">รอบเย็น/ค่ำ (17:00+)</option>
              </select>
            </div>
          </div>

          {/* Vehicle Category Filter Pills (AC pill placed at the very end) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: t('busStops.filters.all', 'ทั้งหมด') },
              { id: 'minibus', label: t('busStops.filters.minibus', 'รถสองแถว / มินิบัส') },
              { id: 'van', label: t('busStops.filters.van', 'รถตู้') },
              { id: 'bus', label: t('busStops.filters.bus', 'รถทัวร์') },
              { id: 'ac', label: t('ri.vehicleAc', 'รถแอร์ (ปรับอากาศ)') },
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
            {searchQuery ? `"${searchQuery}"` : t('busStops.title')}
          </h1>
          <span className="text-xs font-medium text-gray-500">
            {filteredRoutes.length} {filteredRoutes.length === 1 ? 'route' : 'routes'} found
          </span>
        </div>

        {/* Content Grid (Clean, Spacious, Uncluttered Cards) */}
        {filteredRoutes.length === 0 ? (
          <div className="w-full bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
            <FaBus size={36} className="text-gray-300" />
            <h3 className="text-base font-bold text-gray-800">{t('busStops.noResult')}</h3>
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
                onClick={() => setModalRoute(card)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col group"
              >
                {/* Photo Area */}
                <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                  <img
                    src={card.photo}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                    {card.vehicleTypeBadge}
                  </span>
                  {card.route_code && (
                    <span className="absolute bottom-3 left-3 bg-[#241D4F] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      {t('busStops.card.line')} {card.routeCode}
                    </span>
                  )}
                </div>

                {/* Card Details (Spacious & Clean) */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-pink-600 transition-colors">
                      {card.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <FiMapPin size={14} className="text-pink-500 flex-shrink-0" />
                      <span className="line-clamp-1">{card.origin}</span>
                      <FiArrowRight size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 line-clamp-1">{card.destination}</span>
                    </div>
                  </div>

                  {/* View Details CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs font-semibold text-pink-600 group-hover:text-pink-700">
                    <span>{t('busStops.viewDetails', 'ดูรายละเอียด')}</span>
                    <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Interactive Detail Popup Modal */}
      <AnimatePresence>
        {modalRoute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalRoute(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Header Image Area */}
              <div className="relative h-48 w-full bg-gray-900 flex-shrink-0">
                <img
                  src={modalRoute.photo}
                  alt={modalRoute.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Close Button */}
                <button
                  onClick={() => setModalRoute(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer z-20"
                  aria-label="Close"
                >
                  <FiX size={20} />
                </button>

                {/* Badges and Title on Header */}
                <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-pink-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                      {t('busStops.card.line')} {modalRoute.routeCode}
                    </span>
                    <span className="bg-white/90 text-gray-900 text-xs font-semibold px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                      {modalRoute.vehicleTypeBadge}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white leading-tight drop-shadow">
                    {modalRoute.title}
                  </h2>
                </div>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-6 overflow-y-auto flex flex-col gap-5">
                {/* Origin & Destination Line */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t('ri.from', 'ต้นทาง')}</span>
                    <span className="text-base font-bold text-[#241D4F]">{modalRoute.origin}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-400">
                    <FiArrowRight size={18} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{t('ri.to', 'ปลายทาง')}</span>
                    <span className="text-base font-bold text-[#241D4F]">{modalRoute.destination}</span>
                  </div>
                </div>

                {/* Key Information List */}
                <div className="flex flex-col gap-3 py-1">
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500">
                      <FiClock size={15} className="text-gray-400" />
                      <span>{t('busStops.modal.time', 'เวลาเดินรถ')}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900">{modalRoute.timeRange}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500">
                      <FiDollarSign size={15} className="text-gray-400" />
                      <span>{t('busStops.modal.fare', 'อัตราค่าโดยสาร')}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900">{modalRoute.fare}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500">
                      <FaBuilding size={14} className="text-gray-400" />
                      <span>{t('busStops.modal.operator', 'ผู้ให้บริการ')}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900">{modalRoute.company}</span>
                  </div>
                </div>

                {/* Stops Via Section */}
                {modalRoute.stopsVia && (
                  <div className="pt-3 border-t border-gray-100 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <FiNavigation className="text-gray-400" size={14} />
                      {t('busStops.modal.stopsVia', 'จุดจอดระหว่างทาง')}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {modalRoute.stopsVia}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer CTA */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={() => {
                    const orig = modalRoute.originTh || modalRoute.origin;
                    const dest = modalRoute.destTh || modalRoute.destination;
                    setModalRoute(null);
                    navigate(`/route-information?origin=${encodeURIComponent(orig)}&destination=${encodeURIComponent(dest)}`);
                  }}
                  className="w-full bg-[#241D4F] hover:bg-[#1a143b] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('busStops.modal.viewOnMap', 'ดูจำลองเส้นทางบนแผนที่')}</span>
                  <FiArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BusStops;