"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

   useEffect(() => {
     if (audioRef.current) {
       audioRef.current.volume = 0.5; // Mengatur volume di 50%

       // TAMBAHKAN BARIS INI: Memulai lagu dari detik ke-8
       audioRef.current.currentTime = 8;

       const playPromise = audioRef.current.play();
       if (playPromise !== undefined) {
         playPromise
           .then(() => {
             setIsPlaying(true);
           })
           .catch((error) => {
             console.log(
               "Browser mewajibkan user klik dulu sebelum audio bisa diputar.",
             );
             setIsPlaying(false);
           });
       }
     }
   }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[9999]"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.5 }} // Muncul berbarengan setelah loading animasi sketsa
    >
      {/* Mengambil file dari folder public/ */}
      <audio ref={audioRef} src="/OneVision.mp3#t=8" loop />

      <button
        onClick={toggleAudio}
        className="flex items-center justify-center w-14 h-14 bg-[#f0ebe1] border-2 border-black rounded-full shadow-md hover:bg-yellow-200 transition-colors -rotate-2"
        style={{
          filter: "drop-shadow(2px 4px 0px rgba(0,0,0,0.8))", // Menambahkan efek sketsa tangan/kasar
        }}
        aria-label="Toggle Lagu"
      >
        {isPlaying ? (
          <Volume2 size={24} className="text-black" />
        ) : (
          <VolumeX size={24} className="text-gray-500" />
        )}
      </button>
    </motion.div>
  );
};

export default FloatingAudio;