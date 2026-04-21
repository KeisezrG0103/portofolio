export default function Footer() {
  return (
    // Penambahan 'shrink-0' dan dipastikan 'mt-auto' berfungsi mendorongnya ke dasar min-h-[100dvh]
    <footer className="w-full py-8 text-center border-t-4 border-dashed border-gray-500 bg-transparent shrink-0 mt-auto relative z-10">
      <div className="flex justify-center gap-8 mb-4 text-2xl font-bold">
        <a href="#" className="hover:font-black transition-all underline decoration-wavy">Github</a>
        <a href="#" className="hover:font-black transition-all underline decoration-wavy">LinkedIn</a>
      </div>
      <p className="text-xl text-gray-800 font-medium">Digambar dengan ☕ dan Kode.</p>
    </footer>
  );
}