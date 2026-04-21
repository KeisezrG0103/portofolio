"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const nameText = "NICHOLAS IVAN";

export default function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    
    // Interval mengetik: 150 milidetik per huruf
    const typingInterval = setInterval(() => {
      setDisplayedText(nameText.substring(0, index + 1));
      index++;
      if (index >= nameText.length) {
        clearInterval(typingInterval);
      }
    }, 150);

    // Waktu selesai dan layar ditarik pergi
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(onComplete, 800);
    }, 3200);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-10%", filter: "blur(5px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center paper-bg"
        >
          {/* Kontainer utama bergaya relatif */}
          <div className="relative flex font-black font-kalam text-5xl md:text-8xl text-gray-800 tracking-widest uppercase">
            
            {/* INVISIBLE PLACEHOLDER: 
                Teks ini menghilang, tapi bertugas "memesan tempat" agar saat teks 
                asli diketik, posisinya tidak melompat-lompat mencari titik tengah layar 
            */}
            <div className="opacity-0 flex">
              <span>{nameText}</span>
              <span className="font-sans font-light -ml-1">|</span>
            </div>

            {/* TEKS YANG SEDANG DIKETIK */}
            <div className="absolute top-0 left-0 flex h-full items-center whitespace-nowrap overflow-hidden">
              <span className="inline-block">
                {displayedText}
              </span>
              
              {/* Kursor Berkedip yang sekarang benar-benar melekat pada huruf terakhir */}
              <motion.span
                animate={{ opacity: [1, 0, 1] }} // Efek Blink kursor
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="font-sans font-light -ml-1 md:-ml-2 text-gray-600"
              >
                |
              </motion.span>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}