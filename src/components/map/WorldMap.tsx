'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface WorldMapProps {
  onRegionClick: (regionId: string) => void;
  selectedRegion: string | null;
}

interface Region {
  id: string;
  name: string;
  bounds: L.LatLngBoundsExpression;
  center: L.LatLngTuple;
}

const regions: Region[] = [
  {
    id: 'eryndor',
    name: 'Eryndor Ormanları',
    bounds: [
      [-200, -300],
      [-100, -200]
    ],
    center: [-150, -250]
  },
  {
    id: 'anvilheim',
    name: 'Anvilheim Zirvesi',
    bounds: [
      [100, 200],
      [200, 300]
    ],
    center: [150, 250]
  }
];

const WorldMap: React.FC<WorldMapProps> = ({ onRegionClick, selectedRegion }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const regionLayersRef = useRef<Record<string, L.Layer>>({});

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

      // Add region layers
      regions.forEach(region => {
        // Create rectangle for region
        const rectangle = L.rectangle(region.bounds, {
          color: '#F59E0B',
          weight: 2,
          fillColor: '#F59E0B',
          fillOpacity: 0.1,
          interactive: true
        });

        // Add hover effects
        rectangle.on('mouseover', () => {
          rectangle.setStyle({
            fillOpacity: 0.3
          });
        });

        rectangle.on('mouseout', () => {
          if (selectedRegion !== region.id) {
            rectangle.setStyle({
              fillOpacity: 0.1
            });
          }
        });

        // Add click handler
        rectangle.on('click', () => {
          onRegionClick(region.id);
        });

        // Add region name label
        const label = L.marker(region.center, {
          icon: L.divIcon({
            className: 'region-label',
            html: `<div class="bg-[#162137]/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span class="text-amber-400 font-risque text-sm">${region.name}</span>
                   </div>`,
            iconSize: [100, 40],
            iconAnchor: [50, 20]
          })
        });

        // Add layers to map
        rectangle.addTo(map);
        label.addTo(map);

        // Store reference to rectangle
        regionLayersRef.current[region.id] = rectangle;
      });

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
  }, [onRegionClick, selectedRegion]);

  // Update region styles when selection changes
  useEffect(() => {
    Object.entries(regionLayersRef.current).forEach(([regionId, layer]) => {
      if (layer instanceof L.Rectangle) {
        if (regionId === selectedRegion) {
          layer.setStyle({
            fillOpacity: 0.3,
            color: '#FBBF24',
            weight: 3
          });
        } else {
          layer.setStyle({
            fillOpacity: 0.1,
            color: '#F59E0B',
            weight: 2
          });
        }
      }
    });
  }, [selectedRegion]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[600px] rounded-xl overflow-hidden" />
      <style jsx global>{`
        .region-label {
          background: none;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default WorldMap; 