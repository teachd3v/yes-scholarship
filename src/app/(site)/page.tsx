import Link from 'next/link';
import { safeFetch } from '@/sanity/client';
import { groq } from 'next-sanity';
import HeroSlider from '@/components/HeroSlider';
import Distribution from '@/components/Distribution';
import Testimonials from '@/components/Testimonials';
import Partners from '@/components/Partners';
import LatestBlog from '@/components/LatestBlog';

// Default/fallback data when Sanity is not configured
const FALLBACK_SLIDES = [
  {
    headline: "Youth Ekselensia Scholarship",
    subheadline: "Mewujudkan mimpi anak bangsa melalui pendidikan yang berkualitas dan berkelanjutan.",
    image: "/images/logo-yes.png",
    cta_text: "Daftar Sekarang",
    cta_link: "/pendaftaran",
  },
];

const FALLBACK_STATS = [
  { number: "150", label: "Penerima Manfaat" },
  { number: "25", label: "Kampus PTN" },
  { number: "4", label: "Angkatan" },
];

async function getHomeData() {
  const [hero, stats, testimonials, distributions, partners, posts, faqs] = await Promise.all([
    safeFetch(groq`*[_type == "hero"][0]{ hero_slider }`),
    safeFetch(groq`*[_type == "stats"][0]{ stats_list }`),
    safeFetch(groq`*[_type == "testimonial"]{ _id, name, role, quote, avatar }`),
    safeFetch(groq`*[_type == "distribution"]{ region, count, province, coordinates }`),
    safeFetch(groq`*[_type == "partners"][0]{ partners_list[]{ name, logo } }`),
    safeFetch(groq`*[_type == "post"] | order(pubDate desc) [0...3]{ title, description, image, tags, pubDate }`),
    safeFetch(groq`*[_type == "faqs"][0]{ faqs_list }`),
  ]);

  return { hero, stats, testimonials, distributions, partners, posts, faqs };
}

export default async function HomePage() {
  const { hero, stats, testimonials, distributions, partners, posts, faqs } = await getHomeData();

  // Use Sanity data or fallbacks
  const heroData = (hero as any)?.hero_slider || FALLBACK_SLIDES;
  const statsData = (stats as any)?.stats_list || FALLBACK_STATS;
  const partnersData = (partners as any)?.partners_list || [];
  const faqsData = (faqs as any)?.faqs_list || [];

  return (
    <main className="bg-[#F8F9FB]">
      {/* Hero Section */}
      <HeroSlider slides={heroData} />

      {/* Stats Section */}
      <section className="relative z-20 -mt-16 max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 text-center">
          {statsData.map((stat: any, i: number) => (
            <div key={i}>
              <div className="text-2xl md:text-4xl font-extrabold text-blue-900">{stat.number}+</div>
              <p className="text-xs md:text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-3">Tentang Program</p>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6">Apa itu Youth Ekselensia Scholarship?</h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
            Youth Ekselensia Scholarship (YES) adalah program beasiswa pendidikan tinggi yang diinisiasi oleh Transformatif EduAction Hub - GREAT Edunesia.
            Program ini bertujuan untuk mengantarkan putra-putri terbaik bangsa dari berbagai pelosok negeri untuk melanjutkan pendidikan di Perguruan Tinggi Negeri terbaik Indonesia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Beasiswa Penuh</h3>
              <p className="text-sm text-slate-500">Biaya pendidikan, bimbingan belajar, dan pendampingan hingga diterima PTN.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Pembinaan Karakter</h3>
              <p className="text-sm text-slate-500">Program mentoring dan pembinaan karakter untuk mencetak pemimpin masa depan.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Jaringan Alumni</h3>
              <p className="text-sm text-slate-500">Terhubung dengan jaringan alumni YES di seluruh Indonesia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution Map */}
      <Distribution distributions={distributions as any[]} />

      {/* Testimonials */}
      <Testimonials testimonials={testimonials as any[]} />

      {/* CTA Section */}
      <section className="bg-blue-900 py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Siap Menjadi Bagian dari YES?</h2>
          <p className="text-blue-200 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Jangan lewatkan kesempatan untuk meraih mimpi pendidikanmu. Daftarkan dirimu sekarang dan jadilah bagian dari pemimpin masa depan bangsa.
          </p>
          <Link
            href="/pendaftaran"
            className="inline-block bg-yellow-400 text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition transform hover:-translate-y-1 shadow-lg"
          >
            Daftar YES 2026
          </Link>
        </div>
      </section>

      {/* FAQs Section */}
      {faqsData.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">Pertanyaan yang Sering Diajukan</h2>
          <div className="space-y-4">
            {faqsData.map((faq: any, i: number) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-100 shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer p-5 md:p-6 font-semibold text-slate-800 text-sm md:text-base">
                  {faq.question}
                  <svg className="w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Partners */}
      {partnersData.length > 0 && <Partners partners={partnersData} />}

      {/* Latest Blog */}
      <LatestBlog posts={posts as any[]} />
    </main>
  );
}
