"use client";
import { motion } from "framer-motion";

const experiences = [
  { year: "Aug 2024 - Feb 2025", role: "Application Developer", company: "Polytron Indonesia" },
  { year: "Aug 2023 - Jan 2024", role: "Asst. Lecturer for Machine Learning & Deep Learning", company: "Universitas Atma Jaya Yogyakarta" },
  { year: "Feb 2023 - Jul 2023", role: "Asst. Lecturer for Discrete Mathematics", company: "Universitas Atma Jaya Yogyakarta" },
  { year: "Sep 2022 - Jan 2023", role: "Asst. Lecturer for Statistics", company: "Universitas Atma Jaya Yogyakarta" },
];

export default function Experience() {
  return (
    <section id="experience" className="h-full flex flex-col justify-center pt-28 pb-12 max-w-4xl mx-auto px-8 w-full">
      <h2 className="text-5xl font-bold mb-12 text-center underline decoration-wavy">Experience</h2>
      
      <div className="border-l-4 border-dashed border-gray-800 mx-auto pl-8 md:pl-16 space-y-10 w-full mb-8">
        {experiences.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`p-6 w-full ${idx % 2 === 0 ? 'pencil-sketch rotate-1' : 'pencil-sketch-alt -rotate-1'}`}
          >
            <div className="font-bold text-lg text-gray-600 mb-1 underline decoration-wavy decoration-gray-400 inline-block">{exp.year}</div>
            <h3 className="text-2xl font-black">{exp.role}</h3>
            <div className="text-xl mt-1 font-medium">{exp.company}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}