"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-40 bg-transparent py-6 px-8 flex justify-between items-center backdrop-blur-sm">
      <div className="text-3xl font-bold -rotate-2 pencil-sketch px-4 py-1 inline-block">
        NICW
      </div>
      <nav className="flex gap-6 text-xl font-semibold">
        <Link href="#about" className="hover:underline decoration-wavy decoration-2 underline-offset-4">
          About
        </Link>
        <Link href="#experience" className="hover:underline decoration-wavy decoration-2 underline-offset-4">
          Experience
        </Link>
        <Link href="#education" className="hover:underline decoration-wavy decoration-2 underline-offset-4">
          Education
        </Link> 
        
      </nav>
    </header>
  );
}