import React, { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

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

const makeMarkerIcon = (color) =>
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="10" fill="${color}" fill-opacity="0.3"/>
      <circle cx="14" cy="14" r="6" fill="${color}"/>
      <circle cx="14" cy="14" r="3" fill="white"/>
    </svg>
  `);

const RoutePolyline = ({ origin, destination, exactOrigin, exactDest }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const rendererRef = useRef(null);
  const [pins, setPins] = useState([]);

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
              },
              {
                lat: leg.end_location.lat(),
                lng: leg.end_location.lng(),
                color: '#FF6B00',
                title: destination,
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
      {pins.map((pin, i) => (
        <Marker
          key={i}
          position={{ lat: pin.lat, lng: pin.lng }}
          title={pin.title}
          clickable={false}
          icon={{
            url: makeMarkerIcon(pin.color),
            scaledSize: { width: 28, height: 28 },
            anchor: { x: 14, y: 14 },
          }}
        />
      ))}
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
