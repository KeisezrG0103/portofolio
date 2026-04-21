"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Footer from "@/components/Footer";
import FloatingAudio from "@/components/FloatingAudio"; 

// Komponen Pembungkus BARU: Auto Tear Reveal
// Kertas akan menutupi layar secara solid, lalu 0.15 detik kemudian
// MURNI MEROBEK DIRINYA SENDIRI secara otomatis.
// Komponen Pembungkus BARU: Auto Tear Reveal
const AutoTearReveal = ({ children, coverBg, contentBg }) => {
  return (
    <section className={`relative w-full h-[100dvh] snap-start snap-always overflow-hidden ${contentBg}`}>

      {/* 
        PERBAIKAN BUG ZOOM (120%): 
        Kita tambahkan 'overflow-y-auto overflow-x-hidden' di sini agar saat isi 
        (teks/gambar/footer) kebesaran melebihi layar, Anda tetap bisa men-scroll turun
        ke ujung bagian Footer di dalam batasan kertas sobek ini.
      */}
      <div className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden hide-scrollbar z-10">

        {/* 'min-h-[100dvh]' memaksa agar isinya terpusat di tengah jika layarnya besar, tapi bebas bergeser memanjang jika layarnya kecil/di-zoom */}
        <div className="w-full min-h-[100dvh] flex flex-col justify-center">
          {children}
        </div>

      </div>

      {/* Bagian Kulit Kertas Atas */}
      <motion.div
        initial={{ y: "0%" }}
        whileInView={{ y: "-100%" }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
        viewport={{ once: true, amount: 0.4 }}
        className={`absolute top-0 left-0 w-full h-[55%] z-20 pointer-events-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] ${coverBg} torn-flap-top`}
      />

      {/* Bagian Kulit Kertas Bawah */}
      <motion.div
        initial={{ y: "0%" }}
        whileInView={{ y: "100%" }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
        viewport={{ once: true, amount: 0.4 }}
        className={`absolute bottom-0 left-0 w-full h-[55%] z-20 pointer-events-none drop-shadow-[0_-15px_15px_rgba(0,0,0,0.5)] ${coverBg} torn-flap-bottom`}
      />
    </section>
  );
};

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    // Wadah scroll dengan properti snap-y snap-mandatory
    // Ini mengunci layar agar bergeser "per halaman layaknya presentasi", bukan seperti website biasa
    <main className="relative bg-[#2a2a2a] font-sans h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar">
      
      {/* Jika header ingin mengikuti scroll, hapus fixed atau taruh di luar. Dalam hal ini kita pakai fixed agar stabil di posisi */}
      <Header />

      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      {!showPreloader && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          
          {/* Layar 1: Hero (Dibungkus Robekan Kulit Kertas Pertama Warna Agak Gelap) */}
          <AutoTearReveal contentBg="paper-bg-alt" coverBg="paper-bg">
            <Hero />
          </AutoTearReveal>

          {/* Layar 2: About (Dibungkus Robekan Kulit Warna Terang) */}
          <AutoTearReveal contentBg="paper-bg" coverBg="paper-bg-alt">
            <About />
          </AutoTearReveal>

          {/* Layar 3: Experience (Dibungkus Robekan Kulit Warna Agak Gelap) */}
          <AutoTearReveal contentBg="paper-bg-alt" coverBg="paper-bg">
            <Experience />
          </AutoTearReveal>

          {/* Layar 4: Education & Footer (Dalam satu layar yang sama dangan dibungkus Warna Terang) */}
          <AutoTearReveal contentBg="paper-bg" coverBg="paper-bg-alt">
            <div className="w-full flex-grow flex flex-col justify-center pt-24 pb-8">
              <Education />
            </div>
            {/* Footer dipaksa berada di paling bawah layar */}
            <div className="mt-auto">
              <Footer />
            </div>
          </AutoTearReveal>

        </motion.div>
      )}
      <FloatingAudio />
    </main>
  );
}
