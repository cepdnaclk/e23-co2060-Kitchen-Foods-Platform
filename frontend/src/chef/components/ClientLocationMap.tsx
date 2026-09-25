import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, Navigation } from 'lucide-react';

interface ClientLocationMapProps {
  clientLat: number;
  clientLng: number;
  clientName?: string;
  chefLat?: number | null;
  chefLng?: number | null;
  className?: string;
}

export const ClientLocationMap: React.FC<ClientLocationMapProps> = ({
  clientLat,
  clientLng,
  clientName = 'Customer',
  chefLat,
  chefLng,
  className = 'h-56 w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Teardown previous instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map centered at client location
    const map = L.map(mapContainerRef.current, {
      center: [clientLat, clientLng],
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Free OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom Client Pin Icon with Pulse
    const clientIcon = L.divIcon({
      className: 'client-map-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
          <div style="position: absolute; width: 34px; height: 34px; background: rgba(249, 115, 22, 0.35); border-radius: 50%; animation: pulse 2s infinite;"></div>
          <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #f97316, #ea580c); border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
            📍
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18],
    });

    // Client Marker
    const clientMarker = L.marker([clientLat, clientLng], { icon: clientIcon }).addTo(map);
    clientMarker
      .bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; color: #0f172a; line-height: 1.4;">
          <strong style="color: #ea580c; display: block; font-size: 13px;">${clientName} (Delivery Location)</strong>
          <span style="color: #64748b; font-size: 11px;">Lat: ${clientLat.toFixed(5)}, Lng: ${clientLng.toFixed(5)}</span>
        </div>`
      )
      .openPopup();

    // If Chef coordinates are available, show chef marker and connecting route line
    if (chefLat != null && chefLng != null && !isNaN(chefLat) && !isNaN(chefLng)) {
      const chefIcon = L.divIcon({
        className: 'chef-map-pin',
        html: `
          <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #10b981, #059669); border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
            👨‍🍳
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -15],
      });

      const chefMarker = L.marker([chefLat, chefLng], { icon: chefIcon }).addTo(map);
      chefMarker.bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
          <strong style="color: #059669; display: block;">Your Kitchen Location</strong>
        </div>`
      );

      // Connecting line
      L.polyline([[chefLat, chefLng], [clientLat, clientLng]], {
        color: '#f97316',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.8,
      }).addTo(map);

      // Fit bounds to include both markers comfortably
      const bounds = L.latLngBounds([[clientLat, clientLng], [chefLat, chefLng]]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // Fix map sizing inside animated modals
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [clientLat, clientLng, chefLat, chefLng, clientName]);

  const osmUrl = `https://www.openstreetmap.org/?mlat=${clientLat}&mlon=${clientLng}#map=16/${clientLat}/${clientLng}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
      <div ref={mapContainerRef} className={className} style={{ minHeight: '200px', zIndex: 1 }} />
      
      {/* Top Overlay Badge */}
      <div className="absolute top-2.5 right-2.5 z-[10] flex items-center gap-2">
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-sm transition-all"
          title="Open in OpenStreetMap"
        >
          <span>OpenStreetMap</span>
          <ExternalLink size={10} />
        </a>
      </div>

      {/* Bottom Coordinates Bar */}
      <div className="absolute bottom-0 inset-x-0 z-[10] px-3 py-1.5 bg-slate-950/85 backdrop-blur-sm border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Navigation size={11} className="text-orange-400" />
          <span>Client GPS: <strong className="text-slate-200 font-mono">{clientLat.toFixed(4)}, {clientLng.toFixed(4)}</strong></span>
        </div>
        <span className="text-emerald-400 font-bold text-[10px]">Within 10 km limit</span>
      </div>
    </div>
  );
};
