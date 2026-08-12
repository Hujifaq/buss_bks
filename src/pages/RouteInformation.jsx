import React, { useEffect, useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './RouteInformation.css';
import RideMap from './RideMap';
import { MoonLoader } from 'react-spinners';

// StepperContent shows the full route timeline including via stops
const StepperContent = ({ origin, originDetail, destination, destinationDetail, viaStops }) => {
  const allStops = [
    { name: origin, detail: originDetail, type: 'start' },
    ...viaStops.map((s) => ({ name: s, type: 'via' })),
    { name: destination, detail: destinationDetail, type: 'end' },
  ].filter((s) => s.name && s.name.trim() !== '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="ri-stepper">
        {allStops.map((stop, index) => {
          const isStart = stop.type === 'start';
          const isEnd = stop.type === 'end';
          let stepClass = 'ri-step';
          if (isStart) stepClass += ' start';
          if (isEnd) stepClass += ' end';

          return (
            <div className={stepClass} key={index}>
              <div className="ri-step-indicator"></div>
              <div className="ri-step-content">
                <h3 className="ri-step-title">
                  {stop.name}
                  {stop.detail && (
                    <span style={{ fontSize: '0.85em', fontWeight: 'normal', color: '#666', marginLeft: '6px' }}>
                      ({stop.detail})
                    </span>
                  )}
                </h3>
                <p className="ri-step-subtitle">
                  {isStart ? 'จุดเริ่มต้น' : isEnd ? 'จุดหมายปลายทาง' : 'จุดแวะพัก'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ri-bottom-banner">
        ข้อมูลนี้เป็นเส้นทางรถตามจุดจอดที่มีในระบบไม่ใช่การติดตามตำแหน่งรถแบบเรียลไทม์
      </div>
    </div>
  );
};

const RouteInformation = () => {
  const [searchParams] = useSearchParams();
  const originQuery = (searchParams.get('origin') || '').trim();
  const destinationQuery = (searchParams.get('destination') || '').trim();

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      try {
        const { data: routes, error } = await supabase.from('bus_routes').select('*');
        if (error) throw error;
        if (!routes || routes.length === 0) return;

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
  const fare =
    routeData?.fare_baht ??
    routeData?.fare_aircon_min_baht ??
    routeData?.fare_fan_min_baht ??
    null;
  const price = fare ? `฿${fare}` : '';
  
  const image =
    foundImage ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop';

  // mapStops: only the two city names for Google Maps geocoding
  const mapStops = [displayOrigin, displayDest];

  return (
    <div className="ri-layout">
      {/* Desktop Sidebar */}
      <aside className="ri-sidebar desktop-only">
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
                {price && (
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                    {price}
                  </span>
                )}
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
