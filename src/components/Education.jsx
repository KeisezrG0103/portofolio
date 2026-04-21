"use client";
import { motion } from "framer-motion";

export default function Education() {
  return (
    <section
      id="education"
      className="h-full flex flex-col justify-center pt-28 pb-12 max-w-4xl mx-auto px-8 w-full"
    >
      <h2 className="text-5xl font-bold mb-12 text-center border-b-4 border-dashed border-gray-800 pb-4 mx-auto inline-block">
        Education
      </h2>

      <div className="grid gap-12">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative pencil-sketch p-8 bg-[#fffdf9]"
        >
          {/* Efek Pin/Paku Payung */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-400 border-2 border-gray-800 shadow-md"></div>

          <div className="font-bold text-gray-500 mb-2">2021-2025</div>
          <h3 className="text-3xl font-black mb-2">Bachelor of Informatics</h3>
          <p className="text-2xl font-semibold bg-yellow-200 inline-block px-2 border border-gray-800 shadow-[2px_2px_0_0_#2a2a2a] mb-4 -rotate-1">
            Web Development and Data Science
          </p>
          {/* GPA */}
          <p className="text-xl font-bold text-gray-700 mb-4">GPA: 3.80/4.00</p>
          <p className="text-lg">
            Focusing on structural logic, algorithmic problem-solving, and Web
            development with modern UI/UX principles. Graduated with{" "}
            <span className="bg-yellow-200 px-1 font-bold border border-gray-800 rounded-sm">
              {" "}
              Cum Laude
            </span>{" "}
            honors.
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative pencil-sketch p-8 bg-[#fffdf9]"
        >
          {/* Efek Pin/Paku Payung */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-400 border-2 border-gray-800 shadow-md"></div>

          <div className="font-bold text-gray-500 mb-2">Currently Pursuing</div>
          <h3 className="text-3xl font-black mb-2">Master's Degree</h3>
          <p className="text-2xl font-semibold bg-yellow-200 inline-block px-2 border border-gray-800 shadow-[2px_2px_0_0_#2a2a2a] mb-4 -rotate-1">
            Data Analytics and Artificial Intelligence
          </p>
          <p className="text-xl font-bold text-gray-700 mb-4">GPA: 4.00/4.00</p>
          <p className="text-lg">
            Focusing on structural logic, algorithmic problem-solving, and
            AI-driven information detection models.
          </p>
        </motion.div>
      </div>
    </section>
  );
}