import HeroSlider from '@/components/HeroSlider';
import Partners from '@/components/Partners';
import LatestBlog from '@/components/LatestBlog';
import Distribution from '@/components/Distribution';
import { client } from '@/sanity/client';

// Mock data to match original Astro content until Sanity is populated
const MOCK_DATA = {
  hero_slider: [
    {
      headline: "Youth Ekselensia Scholarship",
      subheadline: "Mewujudkan mimpi anak bangsa melalui pendidikan yang berkualitas dan berkelanjutan.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
      cta_text: "Daftar Sekarang",
      cta_link: "/pendaftaran"
    },
    {
      headline: "Pimpinan Masa Depan",
      subheadline: "Membentuk karakter dan kompetensi untuk menjadi pemimpin yang transformatif.",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2098&auto=format&fit=crop",
      cta_text: "Pelajari Lebih Lanjut",
      cta_link: "/tentang-kami"
    }
  ],
  stats: [
    { number: "1000+", label: "Penerima Manfaat" },
    { number: "50+", label: "Mitra Universitas" },
    { number: "12", label: "Provinsi" }
  ],
  partners: [
    { name: "Great Edunesia", logo: "https://i0.wp.com/greatedunesia.id/wp-content/uploads/2024/05/ico-ge.webp?fit=495%2C177&ssl=1" },
    { name: "Dompet Dhuafa", logo: "https://www.dompetdhuafa.org/wp-content/uploads/2023/09/logo-dompet-dhuafa.jpg" }
  ],
  faqs: [
    {
      question: "Apa itu YES Scholarship?",
      answer: "YES Scholarship adalah program beasiswa dari GREAT Edunesia yang bertujuan untuk memberikan akses pendidikan bagi pemuda berprestasi dari keluarga kurang mampu."
    },
    {
      question: "Siapa saja yang bisa mendaftar?",
      answer: "Siswa SMA/SMK sederajat kelas 12 yang memiliki prestasi akademik maupun non-akademik dan berasal dari keluarga kurang mampu."
    }
  ]
};

const MOCK_POSTS = [
  {
    title: "Kisah Inspiratif: Dari Desa ke Kampus Impian",
    description: "Perjalanan salah satu penerima beasiswa YES dalam meraih mimpi melanjutkan pendidikan tinggi.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    tags: ["Inspirasi"],
    pubDate: "2026-01-20"
  },
  {
    title: "Tips Lolos Seleksi Beasiswa YES 2026",
    description: "Hal-hal penting yang perlu dipersiapkan untuk menghadapi tahapan seleksi beasiswa.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
    tags: ["Tips"],
    pubDate: "2026-01-15"
  }
];

const logos = {
  great: "https://i0.wp.com/greatedunesia.id/wp-content/uploads/2024/05/ico-ge.webp?fit=495%2C177&ssl=1",
  dd: "https://www.dompetdhuafa.org/wp-content/uploads/2023/09/logo-dompet-dhuafa.jpg"
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

async function getHeroData() {
  return await client.fetch(`*[_type == "hero" && _id == "hero"][0]`);
}

async function getStatsData() {
  return await client.fetch(`*[_type == "stats" && _id == "stats"][0]`);
}

async function getPartnersData() {
  return await client.fetch(`*[_type == "partners" && _id == "partners"][0]`);
}

async function getFaqsData() {
  return await client.fetch(`*[_type == "faqs" && _id == "faqs"][0]`);
}

async function getLatestPosts() {
  return await client.fetch(`*[_type == "post"] | order(pubDate desc) [0...3]`);
}

export default async function Home() {
  const [heroData, statsData, partnersData, faqsData, postsFromSanity] = await Promise.all([
    getHeroData(),
    getStatsData(),
    getPartnersData(),
    getFaqsData(),
    getLatestPosts()
  ]);

  const heroSlider = heroData?.hero_slider || MOCK_DATA.hero_slider;
  const statsList = statsData?.stats_list || MOCK_DATA.stats;
  const partnersList = partnersData?.partners_list || MOCK_DATA.partners;
  const faqsList = faqsData?.faqs_list || MOCK_DATA.faqs;
  const posts = postsFromSanity?.length > 0 ? postsFromSanity : MOCK_POSTS;

  return (
    <main className="bg-[#F8F9FB] pb-20">
      <HeroSlider slides={heroSlider} />

      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 flex flex-wrap gap-8 md:gap-16 justify-center md:justify-start">
            {statsList?.map((stat: any, index: number) => (
              <div key={index}>
                <div className="text-4xl font-extrabold text-blue-900">{stat.number}</div>
                <div className="text-sm text-slate-500 font-semibold uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 pl-0 md:pl-8 flex flex-col items-center md:items-start justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Organized By</span>
            <div className="flex items-center gap-4 opacity-80">
              <img src={logos.great} className="h-8 w-auto" alt="Great Edunesia" />
              <div className="h-8 w-px bg-slate-300"></div>
              <img src={logos.dd} className="h-10 w-auto" alt="Dompet Dhuafa" />
            </div>
          </div>
        </div>
      </section>

      <Distribution />

      <Partners partners={partnersList} />

      <LatestBlog posts={posts} />

      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-slate-900">Pertanyaan Umum</h2>
        <div className="space-y-4">
          {faqsList?.map((faq: any, index: number) => (
            <details
              key={index}
              className="group bg-white rounded-xl border border-slate-200 open:border-blue-500 transition-colors duration-300"
            >
              <summary className="flex justify-between items-center cursor-pointer p-6 font-bold text-slate-800 list-none">
                {faq.question}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
