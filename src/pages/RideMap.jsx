import React, { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useTranslation } from 'react-i18next';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const makeMarkerIconWithLabel = (color, text, type, t) => {
  const prefix = type === 'start' ? t('map.origin') : type === 'end' ? t('map.dest') : '';
  const displayText = `${prefix}${text || ''}`.trim();
  const safeText = displayText.replace(/["'<>&]/g, '');
  
  // Calculate SVG badge width dynamically based on text length
  const textWidth = Math.max(90, safeText.length * 8.5 + 24);
  const totalWidth = textWidth + 20;
  const centerX = totalWidth / 2;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="54" viewBox="0 0 ${totalWidth} 54">
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <!-- Label Badge Pill -->
      <rect x="10" y="4" width="${textWidth}" height="24" rx="12" fill="#111827" fill-opacity="0.95" stroke="${color}" stroke-width="2" filter="url(#shadow)"/>
      <text x="${centerX}" y="20" fill="#ffffff" font-size="11" font-weight="700" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle">${safeText}</text>
      <!-- Small Pointer Arrow -->
      <polygon points="${centerX - 5},28 ${centerX + 5},28 ${centerX},34" fill="${color}" />
      <!-- Pin Dot Anchor -->
      <circle cx="${centerX}" cy="42" r="9" fill="${color}" fill-opacity="0.35"/>
      <circle cx="${centerX}" cy="42" r="6" fill="${color}"/>
      <circle cx="${centerX}" cy="42" r="2.5" fill="#ffffff"/>
    </svg>
  `;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: { width: totalWidth, height: 54 },
    anchor: { x: centerX, y: 42 }
  };
};

const RoutePolyline = ({ origin, destination, exactOrigin, exactDest }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const rendererRef = useRef(null);
  const [pins, setPins] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!map || !routesLibrary || !origin || !destination) return;

    // Clean up previous renderer
    if (rendererRef.current) {
      rendererRef.current.setMap(null);
    }

    const directionsService = new routesLibrary.DirectionsService();
    const directionsRenderer = new routesLibrary.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#FF4D85',
        strokeWeight: 6,
        strokeOpacity: 0.9,
      },
    });
    directionsRenderer.setMap(map);
    rendererRef.current = directionsRenderer;

    const originQuery = exactOrigin || (origin.includes('ไทย') ? origin : origin + ' ประเทศไทย');
    const destQuery = exactDest || (destination.includes('ไทย') ? destination : destination + ' ประเทศไทย');

    directionsService.route(
      {
        origin: originQuery,
        destination: destQuery,
        travelMode: routesLibrary.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === routesLibrary.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);

          const leg = result.routes[0]?.legs[0];
          if (leg) {
            setPins([
              {
                lat: leg.start_location.lat(),
                lng: leg.start_location.lng(),
                color: '#FF4D85',
                title: origin,
                type: 'start',
              },
              {
                lat: leg.end_location.lat(),
                lng: leg.end_location.lng(),
                color: '#FF6B00',
                title: destination,
                type: 'end',
              },
            ]);
          }
        } else {
          console.warn('Directions API failed:', status, 'for', originQuery, '->', destQuery);
        }
      }
    );

    return () => {
      if (rendererRef.current) {
        rendererRef.current.setMap(null);
      }
    };
  }, [map, routesLibrary, origin, destination]);

  return (
    <>
      {pins.map((pin, i) => {
        const iconConfig = makeMarkerIconWithLabel(pin.color, pin.title, pin.type, t);
        return (
          <Marker
            key={i}
            position={{ lat: pin.lat, lng: pin.lng }}
            title={pin.title}
            clickable={false}
            icon={iconConfig}
          />
        );
      })}
    </>
  );
};

// mapStops = [originCityName, destinationCityName] — ONLY city names for geocoding
const RideMap = ({ mapStops = [], exactOrigin, exactDest }) => {
  const origin = mapStops[0] || '';
  const destination = mapStops[mapStops.length - 1] || '';

  // Default map center between BKK and Korat
  const center = { lat: 14.39, lng: 101.35 };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={center}
          defaultZoom={8}
          gestureHandling="greedy"
          disableDefaultUI={true}
          styles={MAP_STYLE}
        >
          {origin && destination && (
            <RoutePolyline origin={origin} destination={destination} exactOrigin={exactOrigin} exactDest={exactDest} />
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default RideMap;
