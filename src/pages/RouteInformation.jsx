import React, { useEffect, useState, useMemo, useRef } from 'react';
import { FiClock, FiSearch, FiMapPin, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { FaExchangeAlt } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './RouteInformation.css';
import RideMap from './RideMap';
import { MoonLoader } from 'react-spinners';

// Component for Route Search Box (used in sidebar and mobile header)
const RouteSearchBox = ({
  originInput,
  setOriginInput,
  destInput,
  setDestInput,
  locationOptions,
  allDbRoutes,
  onSearch,
  onSwap,
  onSelectQuickRoute,
}) => {
  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const originRef = useRef(null);
  const destRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setIsOriginOpen(false);
      }
      if (destRef.current && !destRef.current.contains(event.target)) {
        setIsDestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOrigins = useMemo(() => {
    if (!originInput.trim()) return locationOptions;
    return locationOptions.filter((loc) =>
      loc.toLowerCase().includes(originInput.toLowerCase().trim())
    );
  }, [originInput, locationOptions]);

  const filteredDests = useMemo(() => {
    if (!destInput.trim()) return locationOptions;
    return locationOptions.filter((loc) =>
      loc.toLowerCase().includes(destInput.toLowerCase().trim())
    );
  }, [destInput, locationOptions]);

  return (
    <div className="ri-search-container">
      <div className="ri-search-header-title">
        <FiSearch size={14} className="text-gray-500" />
        <span>ค้นหาเส้นทาง</span>
      </div>

      <div className="ri-search-inputs-wrapper">
        {/* Origin Field */}
        <div className="ri-search-field" ref={originRef}>
          <FiMapPin className="ri-field-icon origin" size={15} />
          <input
            type="text"
            value={originInput}
            onChange={(e) => {
              setOriginInput(e.target.value);
              setIsOriginOpen(true);
            }}
            onFocus={() => setIsOriginOpen(true)}
            placeholder="ต้นทาง"
            className="ri-search-input"
          />
          {isOriginOpen && filteredOrigins.length > 0 && (
            <div className="ri-autocomplete-dropdown">
              {filteredOrigins.map((loc) => (
                <div
                  key={loc}
                  className="ri-autocomplete-item"
                  onClick={() => {
                    setOriginInput(loc);
                    setIsOriginOpen(false);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Field */}
        <div className="ri-search-field" ref={destRef}>
          <FiMapPin className="ri-field-icon dest" size={15} />
          <input
            type="text"
            value={destInput}
            onChange={(e) => {
              setDestInput(e.target.value);
              setIsDestOpen(true);
            }}
            onFocus={() => setIsDestOpen(true)}
            placeholder="ปลายทาง"
            className="ri-search-input"
          />
          {isDestOpen && filteredDests.length > 0 && (
            <div className="ri-autocomplete-dropdown">
              {filteredDests.map((loc) => (
                <div
                  key={loc}
                  className="ri-autocomplete-item"
                  onClick={() => {
                    setDestInput(loc);
                    setIsDestOpen(false);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions: Swap & Search */}
      <div className="ri-search-actions">
        <button
          type="button"
          onClick={onSwap}
          className="ri-swap-btn"
          title="สลับต้นทาง-ปลายทาง"
        >
          <FaExchangeAlt size={13} />
        </button>
        <button
          type="button"
          onClick={() => onSearch(originInput, destInput)}
          className="ri-submit-btn"
        >
          <FiSearch size={14} />
          <span>ค้นหา</span>
        </button>
      </div>

      {/* Quick Select Dropdown */}
      {allDbRoutes.length > 0 && (
        <div className="ri-quick-select-wrapper">
          <select
            className="ri-quick-select"
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              if (!isNaN(idx) && allDbRoutes[idx]) {
                onSelectQuickRoute(allDbRoutes[idx]);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              เลือกเส้นทาง...
            </option>
            {allDbRoutes.map((r, i) => {
              const title = r.route_name_th || r.route_name_en || `สาย ${r.route_code || ''}`;
              return (
                <option key={r.route_id || i} value={i}>
                  {r.route_code ? `[สาย ${r.route_code}] ` : ''}{title}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </div>
  );
};

// StepperContent shows the full route timeline including via stops
const StepperContent = ({ origin, originDetail, destination, destinationDetail, viaStops }) => {
  const allStops = [
    { name: origin, detail: originDetail, type: 'start' },
    ...viaStops.map((s) => ({ name: s, type: 'via' })),
    { name: destination, detail: destinationDetail, type: 'end' },
  ].filter((s) => s.name && s.name.trim() !== '');

  return (
    <div className="ri-stepper-container">
      <div className="ri-stepper">
        {allStops.map((stop, index) => {
          const isStart = stop.type === 'start';
          const isEnd = stop.type === 'end';
          const isLast = index === allStops.length - 1;

          return (
            <div className={`ri-step ${stop.type}`} key={index}>
              {/* Timeline Indicator Column */}
              <div className="ri-timeline-col">
                <div className={`ri-step-circle ${stop.type}`}>
                  {(isStart || isEnd) && <div className="ri-inner-dot" />}
                </div>
                {!isLast && <div className="ri-timeline-line" />}
              </div>

              {/* Step Details */}
              <div className="ri-step-content">
                <div className="ri-step-header">
                  <h3 className="ri-step-title">{stop.name}</h3>
                  {stop.detail && (
                    <span className="ri-step-detail">
                      ({stop.detail})
                    </span>
                  )}
                </div>
                <span className={`ri-step-tag ${stop.type}`}>
                  {isStart ? 'จุดเริ่มต้น' : isEnd ? 'จุดหมายปลายทาง' : 'จุดแวะพัก'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ri-bottom-banner">
        ข้อมูลนี้เป็นเส้นทางรถตามจุดจอดที่มีในระบบ ไม่ใช่การติดตามตำแหน่งรถแบบเรียลไทม์
      </div>
    </div>
  );
};

const RouteInformation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const originQuery = (searchParams.get('origin') || '').trim();
  const destinationQuery = (searchParams.get('destination') || '').trim();

  const [allDbRoutes, setAllDbRoutes] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Search input fields local state
  const [originInput, setOriginInput] = useState(originQuery);
  const [destInput, setDestInput] = useState(destinationQuery);

  // Keep search inputs synced if URL search params change
  useEffect(() => {
    setOriginInput(originQuery);
    setDestInput(destinationQuery);
  }, [originQuery, destinationQuery]);

  // Fetch Supabase route data once on mount or query change
  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      try {
        const { data: routes, error } = await supabase.from('bus_routes').select('*');
        if (error) throw error;
        if (!routes || routes.length === 0) return;

        setAllDbRoutes(routes);

        let matchedRoutes = [];

        // Step 1: Perfect match
        if (originQuery && destinationQuery) {
          matchedRoutes = routes.filter((r) => {
            const combined = ((r.route_name_th || '') + ' ' + (r.route_name_en || '')).toLowerCase();
            return (
              combined.includes(originQuery.toLowerCase()) &&
              combined.includes(destinationQuery.toLowerCase())
            );
          });
        }

        // Step 2: Partial match
        if (matchedRoutes.length === 0 && (originQuery || destinationQuery)) {
          matchedRoutes = routes.filter((r) => {
            const combined = ((r.route_name_th || '') + ' ' + (r.route_name_en || '')).toLowerCase();
            return (
              (originQuery && combined.includes(originQuery.toLowerCase())) ||
              (destinationQuery && combined.includes(destinationQuery.toLowerCase()))
            );
          });
        }

        // Step 3: Fallback
        if (matchedRoutes.length === 0) matchedRoutes = [routes[0]];

        setAvailableRoutes(matchedRoutes);
        setSelectedRouteIndex(0);
      } catch (err) {
        console.error('Error fetching route:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [originQuery, destinationQuery]);

  // Distinct locations array for search autocomplete
  const locationOptions = useMemo(() => {
    const locSet = new Set();
    allDbRoutes.forEach((r) => {
      if (r.route_name_th) {
        const parts = r.route_name_th.split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);
        parts.forEach((p) => locSet.add(p));
      }
    });
    return Array.from(locSet);
  }, [allDbRoutes]);

  const handleSearchSubmit = (orig, dest) => {
    const params = {};
    if (orig.trim()) params.origin = orig.trim();
    if (dest.trim()) params.destination = dest.trim();
    setSearchParams(params);
  };

  const handleSwap = () => {
    const tempO = originInput;
    const tempD = destInput;
    setOriginInput(tempD);
    setDestInput(tempO);
    handleSearchSubmit(tempD, tempO);
  };

  const handleSelectQuickRoute = (route) => {
    let o = '';
    let d = '';
    if (route.route_name_th) {
      const parts = route.route_name_th.split(/\s*[-–—_:|]\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        o = parts[0];
        d = parts[parts.length - 1];
      }
    }
    if (!o) o = route.route_name_th || 'นครราชสีมา';
    if (!d) d = 'ปลายทาง';

    setOriginInput(o);
    setDestInput(d);
    handleSearchSubmit(o, d);
  };

  const routeData = availableRoutes[selectedRouteIndex] || null;

  // --- Derive parsed data dynamically on render ---
  let mapOrigin = '';
  let mapDestination = '';
  let mapOriginEn = '';
  let mapDestinationEn = '';
  let viaStops = [];
  let exactOrigin = null;
  let exactDest = null;

  if (routeData) {
    let routeOrigin = '';
    let routeDestination = '';

    if (routeData.route_name_th) {
      const parts = routeData.route_name_th.split(/\s*[-–—_]\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        routeOrigin = parts[0];
        routeDestination = parts[parts.length - 1];
      }
    }

    if (!routeOrigin && routeData.route_name_en) {
      const parts = routeData.route_name_en.split(/\s*[-–—_]\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        routeOrigin = parts[0];
        routeDestination = parts[parts.length - 1];
      }
    }

    if (!routeOrigin) routeOrigin = originQuery || routeData.route_name_th || 'Origin';
    if (!routeDestination) routeDestination = destinationQuery || 'Destination';

    if (routeData.stops_via) {
      viaStops = routeData.stops_via
        .split(/[,|;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      
      if (viaStops.length === 0 && routeData.stops_via.trim().length > 0) {
        viaStops = [routeData.stops_via.trim()];
      }
    }

    let oLat = routeData.origin_lat;
    let oLng = routeData.origin_lng;
    let dLat = routeData.dest_lat;
    let dLng = routeData.dest_lng;

    let enOriginProper = '';
    let enDestProper = '';

    if (routeData.route_name_en) {
      const parts = routeData.route_name_en.split(/\s*[-–—_]\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        enOriginProper = parts[0];
        enDestProper = parts[parts.length - 1];
      }
    }

    if (routeOrigin && routeDestination) {
      const dbOriginLower = routeOrigin.toLowerCase();
      const dbDestLower = routeDestination.toLowerCase();
      
      const enOriginLower = enOriginProper.toLowerCase();
      const enDestLower = enDestProper.toLowerCase();

      let shouldReverse = false;
      const queryOriginLower = originQuery.toLowerCase();
      const queryDestLower = destinationQuery.toLowerCase();

      if (
        queryOriginLower && 
        (dbDestLower.includes(queryOriginLower) || (enDestLower && enDestLower.includes(queryOriginLower)))
      ) {
        shouldReverse = true;
      } else if (
        queryDestLower && 
        (dbOriginLower.includes(queryDestLower) || (enOriginLower && enOriginLower.includes(queryDestLower)))
      ) {
        shouldReverse = true;
      }

      if (shouldReverse) {
        const temp = routeOrigin;
        routeOrigin = routeDestination;
        routeDestination = temp;
        
        const tempEn = enOriginProper;
        enOriginProper = enDestProper;
        enDestProper = tempEn;

        viaStops.reverse();
        
        const tLat = oLat;
        const tLng = oLng;
        oLat = dLat;
        oLng = dLng;
        dLat = tLat;
        dLng = tLng;
      }
    }

    mapOrigin = routeOrigin;
    mapDestination = routeDestination;
    mapOriginEn = enOriginProper;
    mapDestinationEn = enDestProper;
    exactOrigin = (oLat && oLng) ? { lat: parseFloat(oLat), lng: parseFloat(oLng) } : null;
    exactDest = (dLat && dLng) ? { lat: parseFloat(dLat), lng: parseFloat(dLng) } : null;
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <MoonLoader color="#ff4d85" />
      </div>
    );
  }

  const displayOrigin = mapOrigin || originQuery || 'กรุงเทพฯ';
  const displayDest = mapDestination || destinationQuery || 'นครราชสีมา';
  const title = `${displayOrigin} - ${displayDest}`;

  // Custom details for the brackets based on user preference
  let originDetail = mapOriginEn;
  if (displayOrigin === 'นครราชสีมา') {
    originDetail = 'สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่ 1';
  }

  let destDetail = routeData?.location_source || mapDestinationEn;
  if (displayDest === 'นครราชสีมา') {
    destDetail = 'สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา แห่งที่ 1';
  }

  // Fuzzy match for company and image columns
  let foundCompany = null;
  let foundImage = null;
  
  if (routeData) {
    const keys = Object.keys(routeData);
    
    // Find company
    const companyKey = keys.find(k => k.toLowerCase().includes('company') || k.toLowerCase().includes('บริษัท'));
    if (companyKey) foundCompany = routeData[companyKey];
    
    // Find image
    const imageKey = keys.find(k => k.toLowerCase().includes('photo') || k.toLowerCase().includes('image') || k.toLowerCase().includes('pic') || k.toLowerCase().includes('img'));
    if (imageKey) foundImage = routeData[imageKey];
  }

  const company =
    foundCompany ||
    (routeData?.vehicle_type === 'van'
      ? 'รถตู้'
      : routeData?.vehicle_type === 'minibus'
      ? 'มินิบัส'
      : 'BKS');
      
  const timeRange = routeData?.departure_time_range_raw || '–';
  
  const image =
    foundImage ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop';

  // mapStops: only the two city names for Google Maps geocoding
  const mapStops = [displayOrigin, displayDest];

  return (
    <div className="ri-layout">
      {/* Desktop Sidebar */}
      <aside className="ri-sidebar desktop-only">
        {/* Route Search System Container */}
        <RouteSearchBox
          originInput={originInput}
          setOriginInput={setOriginInput}
          destInput={destInput}
          setDestInput={setDestInput}
          locationOptions={locationOptions}
          allDbRoutes={allDbRoutes}
          onSearch={handleSearchSubmit}
          onSwap={handleSwap}
          onSelectQuickRoute={handleSelectQuickRoute}
        />

        <StepperContent
          origin={displayOrigin}
          originDetail={originDetail}
          destination={displayDest}
          destinationDetail={destDetail}
          viaStops={viaStops}
        />
      </aside>

      {/* Main Content */}
      <main className="ri-main">
        {/* Mobile Search Banner */}
        <div className="mobile-only ri-mobile-search-banner">
          <RouteSearchBox
            originInput={originInput}
            setOriginInput={setOriginInput}
            destInput={destInput}
            setDestInput={setDestInput}
            locationOptions={locationOptions}
            allDbRoutes={allDbRoutes}
            onSearch={handleSearchSubmit}
            onSwap={handleSwap}
            onSelectQuickRoute={handleSelectQuickRoute}
          />
        </div>

        {/* Map Area */}
        <div className="ri-map-area">
          <RideMap mapStops={mapStops} exactOrigin={exactOrigin} exactDest={exactDest} />

          {/* Info Card */}
          <div className="ri-info-card">
            <div className="ri-card-content">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <span className="ri-badge">{company}</span>
              </div>
              <h2 className="ri-card-title">{title}</h2>

              {/* Company Selection Row */}
              {availableRoutes.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
                  {availableRoutes.map((r, idx) => {
                    const keys = Object.keys(r);
                    const cKey = keys.find(k => k.toLowerCase().includes('company') || k.toLowerCase().includes('บริษัท'));
                    const cName = (cKey ? r[cKey] : null) || (r.vehicle_type === 'van' ? 'รถตู้' : r.vehicle_type === 'minibus' ? 'มินิบัส' : 'BKS');
                    const isActive = idx === selectedRouteIndex;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedRouteIndex(idx)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          border: `1px solid ${isActive ? '#ff4d85' : '#444'}`,
                          background: isActive ? '#ff4d85' : 'transparent',
                          color: isActive ? '#fff' : '#aaa',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s',
                          boxShadow: isActive ? '0 4px 10px rgba(255, 77, 133, 0.3)' : 'none'
                        }}
                      >
                        {cName}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="ri-card-divider mobile-only"></div>

              <div className="ri-card-time" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                <FiClock size={16} color="#4da6ff" />
                <span style={{ color: 'white' }}>{timeRange}</span>
              </div>
            </div>

            <div className="ri-card-bus desktop-only">
              <img src={image} alt="Bus" />
            </div>
          </div>
        </div>

        {/* Mobile Stepper */}
        <div className="ri-stepper-mobile mobile-only">
          <StepperContent
            origin={displayOrigin}
            originDetail={originDetail}
            destination={displayDest}
            destinationDetail={destDetail}
            viaStops={viaStops}
          />
        </div>
      </main>
    </div>
  );
};

export default RouteInformation;

