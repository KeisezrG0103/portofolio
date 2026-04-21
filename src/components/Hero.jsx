"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Komponen Khusus: Bintang Kelap-Kelip (Twinkling Star)
const TwinklingStar = ({
  top,
  bottom,
  left,
  right,
  size = 24,
  delay = 0,
  duration = 3,
}) => {
  return (
    <motion.div
      // BUG FIXED: Kata "absolute" telah ditambahkan kembali agar koordinatnya bekerja!
      className="absolute pointer-events-none drop-shadow-[1px_2px_0_rgba(100,100,100,0.2)]"
      style={{ top, bottom, left, right }}
      animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.8, 1.1, 0.8] }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2a2a2a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      >
        <path
          d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
          strokeDasharray="3 1"
        />
      </svg>
    </motion.div>
  );
};

// Komponen Latar Belakang Luar Angkasa (Planet & Taburan Bintang)
// Komponen Latar Belakang Luar Angkasa (Planet & Taburan Bintang)
const SketchedSpace = ({ mousePos }) => {
  return (
    <>
      {/* Planet Utama (Dipusatkan di Tengah-Kanan) */}
      <motion.div
        animate={{ x: mousePos.x * -1.2, y: mousePos.y * -1.2 }}
        className="absolute top-[25%] md:top-[15%] right-[10%] md:right-[20%] z-0 opacity-70"
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="drop-shadow-[3px_4px_0_rgba(100,100,100,0.15)]"
        >
          <circle cx="50" cy="50" r="25" strokeDasharray="4 2 8 3" />
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="12"
            transform="rotate(-20 50 50)"
            strokeDasharray="6 3 12 4"
          />
        </svg>
      </motion.div>

      {/* Lapisan Bintang-Bintang */}
      <motion.div
        animate={{ x: mousePos.x * -0.4, y: mousePos.y * -0.4 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {/* DISEBAR RAPAT MENGELILINGI PUSAT LAYAR (TEKS HERO) */}

        {/* Bintang Kiri Atas Teks */}
        <TwinklingStar top="30%" left="25%" size={36} delay={0} duration={4} />

        {/* Bintang Kanan Atas Teks */}
        <TwinklingStar
          top="25%"
          right="35%"
          size={24}
          delay={1.5}
          duration={3}
        />

        {/* Bintang Kanan Bawah Teks */}
        <TwinklingStar
          bottom="28%"
          right="20%"
          size={32}
          delay={0.7}
          duration={3.5}
        />

        {/* Bintang Kiri Bawah Teks */}
        <TwinklingStar
          bottom="25%"
          left="28%"
          size={28}
          delay={2}
          duration={5}
        />

        {/* Bintang Tengah Atas Jauh (Melayang sedikit tinggi) */}
        <TwinklingStar
          top="15%"
          left="45%"
          size={20}
          delay={0.3}
          duration={2.5}
        />

        {/* Titik-titik Rasi Bintang Sketsa (Dekat pusat gravitasi nama) */}
        <div className="absolute top-[35%] right-[25%] w-1.5 h-1.5 bg-gray-800 rounded-full opacity-60 drop-shadow-[25px_-15px_0_#2a2a2a] shadow-[15px_25px_0_0_#2a2a2a]"></div>
        <div className="absolute bottom-[35%] left-[20%] w-1.5 h-1.5 bg-gray-800 rounded-full opacity-50 drop-shadow-[15px_20px_0_#2a2a2a] shadow-[-15px_25px_0_0_#2a2a2a]"></div>
      </motion.div>
    </>
  );
};


export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
      
      {/* Pemanis Angkasa kini akan terlihat jelas (Planet dan Bintang) */}
      <SketchedSpace mousePos={mousePos} />

      {/* Teks Utama (Berada pada layer z-10 untuk menutupi/overlay bintang dengan aman) */}
      <div className="z-10 text-center relative max-w-4xl px-4 flex flex-col items-center justify-center h-[100dvh] pt-8 pointer-events-none">
        
        <motion.div animate={{ x: mousePos.x * 0.3, y: mousePos.y * 0.3 }} className="mb-4 inline-block -rotate-3">
          <p className="font-kalam text-2xl md:text-3xl text-gray-800 tracking-widest decoration-gray-400 decoration-wavy underline decoration-1 opacity-90 drop-shadow-[1px_1px_0_rgba(255,255,255,0.7)]">
            "per aspera ad astra"
          </p>
        </motion.div>

        <motion.h1 
          animate={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
          className="text-7xl md:text-9xl font-extrabold text-gray-800 drop-shadow-[5px_5px_0_rgba(100,100,100,0.3)] !leading-tight tracking-tight uppercase"
        >
          Nicholas Ivan
        </motion.h1>
        
        <motion.p 
          animate={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
          className="mt-8 text-xl md:text-2xl font-semibold bg-yellow-200 inline-block px-3 py-2 -rotate-2 border-2 border-gray-800 shadow-[4px_4px_0_0_#2a2a2a]"
        >
          Software Developer | AI & Data Analytics
        </motion.p>

        {/* Petunjuk Bawah untuk Scroll (UX) */}
        <div className="mt-16 flex flex-col items-center pointer-events-auto">
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} 
            className="flex flex-col items-center text-gray-500 opacity-80"
          >
            <span className="font-kalam font-bold text-lg tracking-widest mb-1 mt-10">SCROLL</span>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <g stroke="#6b7280" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 5 L20 35" />
                <path d="M10 25 L20 35 L30 25" />
              </g>
            </svg>
          </motion.div>
        </div>

      </div>
    </section>
  );
}