'use client'

import React, { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

const INDONESIA_TOPO_JSON = "/indonesia.topo.json";

interface AngkatanItem {
    batch: string;
    count: number;
}

interface DistributionData {
    region: string;
    province?: string;
    angkatan?: AngkatanItem[];
    coordinates: {
        lat: number;
        lng: number;
    };
}

interface DistributionProps {
    distributions: DistributionData[];
}

const FALLBACK_DATA: DistributionData[] = [
    { region: "Sinjai", province: "Sulawesi Selatan", coordinates: { lat: -5.131, lng: 120.252 }, angkatan: [{ batch: "Angkatan 1", count: 5 }, { batch: "Angkatan 2", count: 5 }] },
    { region: "Surabaya", province: "Jawa Timur", coordinates: { lat: -7.257, lng: 112.752 }, angkatan: [{ batch: "Angkatan 1", count: 4 }, { batch: "Angkatan 2", count: 6 }] },
    { region: "Medan", province: "Sumatera Utara", coordinates: { lat: 3.595, lng: 98.672 }, angkatan: [{ batch: "Angkatan 1", count: 7 }, { batch: "Angkatan 2", count: 8 }] },
    { region: "Bogor", province: "Jawa Barat", coordinates: { lat: -6.597, lng: 106.842 }, angkatan: [{ batch: "Angkatan 1", count: 10 }, { batch: "Angkatan 2", count: 15 }] },
    { region: "Padang", province: "Sumatera Barat", coordinates: { lat: -0.947, lng: 100.417 }, angkatan: [{ batch: "Angkatan 1", count: 6 }, { batch: "Angkatan 2", count: 6 }] },
    { region: "Makassar", province: "Sulawesi Selatan", coordinates: { lat: -5.147, lng: 119.432 }, angkatan: [{ batch: "Angkatan 1", count: 10 }, { batch: "Angkatan 2", count: 10 }] },
    { region: "Pekanbaru", province: "Riau", coordinates: { lat: 0.507, lng: 101.448 }, angkatan: [{ batch: "Angkatan 1", count: 4 }, { batch: "Angkatan 2", count: 4 }] },
    { region: "Yogyakarta", province: "DI Yogyakarta", coordinates: { lat: -7.797, lng: 110.370 }, angkatan: [{ batch: "Angkatan 1", count: 8 }, { batch: "Angkatan 2", count: 10 }] },
];

function getTotal(angkatan?: AngkatanItem[]): number {
    return angkatan?.reduce((s, a) => s + a.count, 0) ?? 0;
}

function TooltipCard({ item, onClose }: { item: DistributionData; onClose?: () => void }) {
    const total = getTotal(item.angkatan);
    return (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-white shadow-2xl z-20 max-w-[210px]" style={{ pointerEvents: onClose ? 'auto' : 'none' }}>
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">Detail Wilayah</span>
                    <h4 className="text-base lg:text-lg font-black text-slate-900 leading-tight mt-0.5">{item.region}</h4>
                    {item.province && <p className="text-[10px] text-slate-400">{item.province}</p>}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs hover:bg-slate-200 mt-0.5"
                    >
                        ✕
                    </button>
                )}
            </div>
            <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
                {item.angkatan?.map((a, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                        <span className="text-[10px] text-slate-500">{a.batch}</span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{a.count} awardee</span>
                    </div>
                ))}
                <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-600">Total</span>
                    <span className="text-xs font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">{total} awardee</span>
                </div>
            </div>
        </div>
    );
}

function MapMarkers({ data, onSelect, selectedRegion, mode }: {
    data: DistributionData[];
    onSelect: (item: DistributionData | null) => void;
    selectedRegion?: string;
    mode: 'mobile' | 'desktop';
}) {
    return (
        <>
            {data.map((item, index) => {
                const lat = item.coordinates?.lat;
                const lng = item.coordinates?.lng;
                if (!lat || !lng) return null;
                const total = getTotal(item.angkatan);
                const isSelected = selectedRegion === item.region;

                // Mobile: tap to toggle, no hover events (hover events conflict with touch)
                // Desktop: hover to show, no click needed
                const handlers = mode === 'mobile'
                    ? { onClick: () => onSelect(isSelected ? null : item) }
                    : { onMouseEnter: () => onSelect(item), onMouseLeave: () => onSelect(null) };

                return (
                    <Marker
                        key={index}
                        coordinates={[lng, lat]}
                        {...handlers}
                    >
                        <circle r={6} fill="#FBBF24" stroke="#FFF" strokeWidth={1.5} className="cursor-pointer" />
                        <circle r={15} fill="#FBBF24" opacity={0.2} className="animate-ping pointer-events-none" />
                        <text
                            textAnchor="middle"
                            y={18}
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fill: "#475569",
                                fontSize: "8px",
                                fontWeight: "bold",
                                pointerEvents: "none",
                                textShadow: "0px 0px 2px rgba(255,255,255,0.9)"
                            }}
                        >
                            {total} {item.region}
                        </text>
                    </Marker>
                );
            })}
        </>
    );
}

const MAP_GEOGRAPHY_STYLE = {
    default: { outline: "none" },
    hover: { fill: "#CBD5E1", outline: "none" },
    pressed: { outline: "none" },
};

export default function Distribution({ distributions }: DistributionProps) {
    const [selectedItem, setSelectedItem] = useState<DistributionData | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);

    const displayData = distributions?.length > 0 ? distributions : FALLBACK_DATA;

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Jangkauan Program</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Sebaran Awardee</h2>
                <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                    Beasiswa YES telah menjangkau talenta-talenta terbaik dari berbagai pelosok negeri.
                </p>
            </div>

            <div className="w-full h-[300px] sm:h-[400px] lg:h-[550px] bg-blue-50/50 rounded-[2rem] lg:rounded-[3rem] border border-blue-100 relative overflow-hidden shadow-inner mb-12">
                {isClient && (
                    <>
                        {/* Mobile: pinch/pan zoom */}
                        <div className="block lg:hidden w-full h-full">
                            <TransformWrapper initialScale={1} minScale={0.8} maxScale={5} centerOnInit panning={{ disabled: false }}>
                                {({ resetTransform }) => (
                                    <>
                                        <TransformComponent
                                            wrapperStyle={{ width: "100%", height: "100%" }}
                                            contentStyle={{ width: "100%", height: "100%" }}
                                        >
                                            <ComposableMap
                                                width={800} height={450}
                                                projection="geoMercator"
                                                projectionConfig={{ center: [118, -2], scale: 850 }}
                                                style={{ width: "100%", height: "100%" }}
                                            >
                                                <Geographies geography={INDONESIA_TOPO_JSON}>
                                                    {({ geographies }: { geographies: any[] }) =>
                                                        geographies.map((geo) => (
                                                            <Geography key={geo.rsmKey} geography={geo} fill="#E2E8F0" stroke="#CBD5E1" strokeWidth={0.5} style={MAP_GEOGRAPHY_STYLE} />
                                                        ))
                                                    }
                                                </Geographies>
                                                <MapMarkers data={displayData} onSelect={setSelectedItem} selectedRegion={selectedItem?.region} mode="mobile" />
                                            </ComposableMap>
                                        </TransformComponent>
                                        <button
                                            onClick={() => { resetTransform(); setSelectedItem(null); }}
                                            className="absolute top-3 right-3 z-30 bg-white/80 backdrop-blur-sm text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-200 shadow-sm active:scale-95 transition-transform"
                                        >
                                            Reset
                                        </button>
                                    </>
                                )}
                            </TransformWrapper>
                        </div>

                        {/* Desktop */}
                        <div className="hidden lg:block w-full h-full">
                            <ComposableMap
                                width={800} height={450}
                                projection="geoMercator"
                                projectionConfig={{ center: [118, -2], scale: 850 }}
                                className="w-full h-full"
                            >
                                <Geographies geography={INDONESIA_TOPO_JSON}>
                                    {({ geographies }: { geographies: any[] }) =>
                                        geographies.map((geo) => (
                                            <Geography key={geo.rsmKey} geography={geo} fill="#E2E8F0" stroke="#CBD5E1" strokeWidth={0.5} style={MAP_GEOGRAPHY_STYLE} />
                                        ))
                                    }
                                </Geographies>
                                <MapMarkers data={displayData} onSelect={setSelectedItem} selectedRegion={selectedItem?.region} mode="desktop" />
                            </ComposableMap>
                        </div>
                    </>
                )}

                {selectedItem && (
                    <TooltipCard item={selectedItem} onClose={() => setSelectedItem(null)} />
                )}

                <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 bg-white/60 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-white/50 text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Peta Persebaran YES
                </div>
                <div className="block lg:hidden absolute bottom-4 left-4 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/50 text-[9px] font-medium text-slate-400">
                    Cubit untuk zoom
                </div>
            </div>
        </section>
    );
}
