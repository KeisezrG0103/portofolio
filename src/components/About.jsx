"use client";
import Image from "next/image";
// IMPORT LOKAL: Tarik file gambar dari map folder relatif ini
import MyAvatar from "./me.png";

export default function About() {
  return (
    <section id="about" className="h-full flex flex-col justify-center pt-28 pb-12 max-w-6xl mx-auto px-8 w-full">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* Teks Kiri */}
        <div className="font-medium text-xl leading-relaxed space-y-6">
          <h2 className="text-5xl font-bold mb-8 underline decoration-wavy">About Me</h2>
          <p>
            Software developer possessing a strong analytical foundation derived from advanced academic research. 
            I am currently pursuing a <span className="bg-yellow-200 px-1 font-bold border border-gray-800 rounded-sm">Master's degree</span> with a specialization in data analytics and artificial intelligence.
          </p>
          <p>
            My core interest resides in <span className="bg-yellow-200 px-1 font-bold border border-gray-800 rounded-sm">structural logic</span>, ranging from consistent algorithmic problem-solving to the design of AI-driven information detection models. 
            Beyond backend infrastructure, I am dedicated to constructing clean digital experiences utilizing modern UI/UX design principles.
          </p>
        </div>

        {/* Gambar Kanan: Bingkai Polaroid */}
        <div className="flex justify-center mt-12 md:mt-0 relative group">
          
          <div className="bg-[#fffdf9] p-4 pt-6 pb-16 rotate-3 shadow-xl border border-gray-300 w-80 max-w-full relative transition-transform hover:rotate-1 hover:scale-105 hover:drop-shadow-[15px_20px_0_rgba(0,0,0,0.1)] duration-500">
            
            {/* Dekorasi Selotip kertas (Masking Tape) Miring */}
            <div 
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/50 backdrop-blur-sm border border-gray-300 shadow-md rotate-[-4deg] z-20" 
              style={{ clipPath: "polygon(4% 5%, 98% 2%, 96% 95%, 2% 98%)" }} 
            />

            {/* Area Kanvas Gambar Penuh */}
            <div className="relative aspect-square w-full border-[3px] border-gray-800 border-dashed bg-gray-100 overflow-hidden pencil-sketch">
              
              {/* === MENGGUNAKAN VARIABEL IMPORT 'MyAvatar' === */}
              <Image 
                src={MyAvatar} 
                alt="Nicholas Ivan" 
                fill
                placeholder="blur" /* Optional: Efek muat (blur) yang lembut berkat import lokal Next.js */
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, 320px"
              />

            </div>

            {/* Tulisan Deskripsi Tulisan Tangan di Bawah Foto Polaroid */}
            <div className="text-center mt-6">
              <h3 className="text-3xl font-black text-gray-800 font-kalam">Nicholas Ivan</h3>
              <p className="text-gray-500 font-kalam text-xl leading-tight mt-1 border-b-2 border-gray-300 border-dotted inline-block">
                AI Enthusiast
              </p>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}