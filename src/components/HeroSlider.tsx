'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { urlFor } from '@/sanity/image'

interface Slide {
  headline: string;
  subheadline: string;
  image: any;
  cta_text: string;
  cta_link: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[500px] md:h-[700px] overflow-hidden bg-slate-900">
      <div id="hero-slider" className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${typeof slide.image === 'string'
                  ? slide.image
                  : urlFor(slide.image).url()
                  }')`
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40"></div>

            <div className="relative z-20 h-full flex items-center max-w-7xl mx-auto px-8 md:px-16">
              <div className="max-w-2xl text-white pt-20">
                <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight">{slide.headline}</h1>
                <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg">{slide.subheadline}</p>
                <Link
                  href={slide.cta_link}
                  className="inline-block bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition transform hover:-translate-y-1"
                >
                  {slide.cta_text}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-15 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/30 hover:bg-white'
              }`}
            aria-label={`Go to slide ${i + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
}