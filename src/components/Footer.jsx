export default function Footer() {
  return (
    // Penambahan 'shrink-0' dan dipastikan 'mt-auto' berfungsi mendorongnya ke dasar min-h-[100dvh]
    <footer className="w-full py-8 text-center border-t-4 border-dashed border-gray-500 bg-transparent shrink-0 mt-auto relative z-10">
      <div className="flex justify-center gap-8 mb-4 text-2xl font-bold">
        <a
          href="https://github.com/KeisezrG0103"
          className="hover:font-black transition-all underline decoration-wavy"
        >
          Github
        </a>
        <a
          href="www.linkedin.com/in/nicholas-ivan-christiaffri-wibowo"
          className="hover:font-black transition-all underline decoration-wavy"
        >
          LinkedIn
        </a>
      </div>

      <p className="text-xl text-gray-800 font-medium">
        Code with love in Yogyakarta, Indonesia. 
      </p>
      <p className="text-lg text-gray-600 mt-2">
        &copy; {new Date().getFullYear()} Nicholas Ivan Christiaffri Wibowo. All rights reserved.
      </p>
    </footer>
  );
}