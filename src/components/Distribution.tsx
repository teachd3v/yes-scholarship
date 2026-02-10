'use client'

import React, { useState, useEffect } from 'react'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

// Indonesia TopoJSON URL (Provinces)
const INDONESIA_TOPO_JSON = "https://code.highcharts.com/mapdata/countries/id/id-all.topo.json";

interface DistributionProps {
    distributions: any[];
}

export default function Distribution({ distributions }: DistributionProps) {
    const [tooltipContent, setTooltipContent] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fallback if no data provided (though server should handle this)
    const displayData = distributions?.length > 0 ? distributions : [
        { region: "Sinjai", count: 10, province: "Sulawesi Selatan", coordinates: { lat: -5.131, lng: 120.252 } },
        { region: "Surabaya", count: 10, province: "Jawa Timur", coordinates: { lat: -7.257, lng: 112.752 } },
        { region: "Medan", count: 15, province: "Sumatera Utara", coordinates: { lat: 3.595, lng: 98.672 } },
        { region: "Bogor", count: 25, province: "Jawa Barat", coordinates: { lat: -6.597, lng: 106.842 } },
        { region: "Padang", count: 12, province: "Sumatera Barat", coordinates: { lat: -0.947, lng: 100.417 } },
        { region: "Makassar", count: 20, province: "Sulawesi Selatan", coordinates: { lat: -5.147, lng: 119.432 } },
        { region: "Banda Aceh", count: 8, province: "Aceh", coordinates: { lat: 5.548, lng: 95.323 } },
        { region: "Semarang", count: 18, province: "Jawa Tengah", coordinates: { lat: -6.966, lng: 110.416 } },
    ];

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">Jangkauan Program</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Sebaran Penerima Manfaat</h2>
                <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                    Beasiswa YES telah menjangkau talenta-talenta terbaik dari berbagai pelosok negeri.
                </p>
            </div>

            {/* Desktop View: Interactive Map */}
            <div className="hidden lg:block w-full h-[500px] bg-blue-50/50 rounded-[3rem] border border-blue-100 relative overflow-hidden shadow-inner mb-12">
                {isClient && (
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{
                            center: [118, -2],
                            scale: 1000
                        }}
                        className="w-full h-full"
                    >
                        <Geographies geography={INDONESIA_TOPO_JSON}>
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo: any) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill="#E2E8F0"
                                        stroke="#CBD5E1"
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { fill: "#CBD5E1", outline: "none" },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>
                        {displayData.map((item, index) => {
                            // Sanity Geopoint usually returns { lat, lng }
                            // If manually mocked above, it's also { lat, lng }
                            // ComposableMap expects [lng, lat]
                            const lat = item.coordinates?.lat;
                            const lng = item.coordinates?.lng;

                            if (!lat || !lng) return null;

                            return (
                                <Marker
                                    key={index}
                                    coordinates={[lng, lat]}
                                    onMouseEnter={() => {
                                        setTooltipContent(`${item.region}|${item.count}|${item.province || ''}`);
                                    }}
                                    onMouseLeave={() => {
                                        setTooltipContent("");
                                    }}
                                >
                                    <circle
                                        r={8}
                                        fill="#FBBF24"
                                        stroke="#FFF"
                                        strokeWidth={2}
                                        className="cursor-pointer hover:scale-125 transition-transform duration-300"
                                    />
                                    <circle
                                        r={20}
                                        fill="#FBBF24"
                                        opacity={0.3}
                                        className="animate-ping pointer-events-none"
                                    />
                                </Marker>
                            )
                        })}
                    </ComposableMap>
                )}

                {/* Custom Tooltip / Popup */}
                {tooltipContent && (
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white shadow-xl z-20 animate-fade-in max-w-xs">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 leading-tight">
                                    {tooltipContent.split('|')[0]}
                                </h4>
                                {tooltipContent.split('|')[2] && (
                                    <p className="text-xs text-slate-500 mb-2">{tooltipContent.split('|')[2]}</p>
                                )}
                                <div className="text-sm font-bold text-blue-600 flex items-center gap-1">
                                    <span className="text-2xl">{tooltipContent.split('|')[1]}</span> Penerima
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/50 text-xs text-slate-500">
                    <p>Arahkan kursor ke titik kuning untuk detail</p>
                </div>
            </div>

            {/* Mobile/Tablet View: Bento Grid (original design) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:hidden gap-4 md:gap-6">
                {displayData.map((item: any, index: number) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:scale-110"></div>

                        <div className="relative z-10">
                            <div className="text-3xl font-bold text-blue-900 mb-1 counter-value">
                                {item.count}
                            </div>
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Penerima
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {item.region}
                            </h3>
                            {item.province && (
                                <p className="text-xs text-slate-500 mt-1">{item.province}</p>
                            )}
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                ))}
            </div>

            {/* Optional: Add a subtle map background decoration if needed later */}
        </section>
    )
}
