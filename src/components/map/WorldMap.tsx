'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WorldMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Calculate bounds based on image dimensions (assuming 1920x1080)
      const imageWidth = 1920;
      const imageHeight = 1080;
      const bounds: L.LatLngBoundsExpression = [
        [-imageHeight/2, -imageWidth/2] as L.LatLngTuple,
        [imageHeight/2, imageWidth/2] as L.LatLngTuple
      ];

      // Create map instance
      const map = L.map(mapRef.current, {
        crs: L.CRS.Simple,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: -1,
        maxZoom: 2,
        zoom: -1,
        center: [0, 0],
        attributionControl: false,
        zoomControl: false
      });

      // Set initial view
      map.fitBounds(bounds);

      // Add custom zoom control to top-right
      L.control.zoom({
        position: 'topright'
      }).addTo(map);

      // Add the image overlay
      L.imageOverlay('/map.png', bounds).addTo(map);

      // Store map instance
      mapInstanceRef.current = map;

      // Cleanup on unmount
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  return <div ref={mapRef} className="w-full h-[600px] rounded-xl overflow-hidden" />;
};

export default WorldMap; 