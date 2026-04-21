# File: agents.md
# Tujuan: Instruksi Pembangunan Portofolio Tema "Kertas dan Pensil"

## 1. Persona dan Konteks Proyek
Bertindaklah sebagai Senior React Developer dengan 12 tahun pengalaman yang fokus pada UI/UX organik dan interaksi *micro-animations*. 
Tugas Anda adalah membangun portofolio web menggunakan React (Vite). 
Tema desain adalah "Kertas dan Pensil" — antarmuka tidak boleh terlihat kaku, melainkan harus menyerupai lembaran kertas asli yang tidak sempurna dengan elemen yang seolah-olah digambar tangan (sketsa).

## 2. Tech Stack & Dependencies
Instal dan gunakan pustaka berikut:
- Framework: React (JSX) + Vite
- Styling: Tailwind CSS (bersama `clsx` dan `tailwind-merge` untuk utilitas kelas)
- Animasi & Interaksi 3D: `framer-motion`
- Ikonografi (Sketsa): `lucide-react`

## 3. Aturan Desain Global (CSS & Tema)
Buat file `index.css` dengan spesifikasi berikut:
- **Background**: Buat tekstur kertas lecek (crumpled) menggunakan SVG `feTurbulence` sebagai filter *noise*, dicampur dengan warna dasar `#f0ebe1`.
- **Tipografi**: Gunakan font bergaya tulisan tangan atau mesin tik seperti 'Indie Flower', 'Kalam', atau 'Comic Neue' dari Google Fonts.
- **Torn Edge (Robekan Kertas)**: Buat *utility class* `.torn-edge` menggunakan `clip-path: polygon(...)` yang asimetris untuk memberikan efek robekan kertas di ujung *container*.
- **Pencil Sketch Effect**: Buat kelas `.pencil-sketch` yang menambahkan `drop-shadow` tipis, *border* sedikit melenceng, dan transformasi rotasi acak kecil (misal: `rotate(1deg)`) pada elemen untuk menghilangkan kesan simetris.

## 4. Struktur File & Instruksi Komponen
Hasilkan file-file berikut secara modular di dalam folder `src/components/`:

### A. `Preloader.jsx`
- **UI**: Layar penuh dengan background kertas. Tengah: Ikon pensil (`PenTool` dari Lucide) sedang bergerak ke kiri dan kanan.
- **Animasi (Framer Motion)**: Buat progres bar yang diisi dengan goresan kasar. Gunakan `AnimatePresence` di `App.jsx` untuk menghilangkan preloader ini setelah 2.5 detik dengan efek *fade out* ke atas (`y: "-100%"`).

### B. `Header.jsx`
- **UI**: Navigasi transparan di bagian atas. Nama logo teks miring (transform: `-rotate-2deg`). 
- **Interaksi**: Link navigasi (Tentang, Pengalaman) menggunakan efek coretan garis bawah (`underline decoration-wavy`) saat di-*hover*.

### C. `Hero.jsx` (Efek 3D Parallax)
- **UI**: Elemen teks judul utama "Karya & Goresan" yang tebal dengan efek bayangan sketsa.
- **Interaksi 3D Parallax**: Gunakan `onMouseMove` untuk melacak posisi kursor (atau `useScroll`/`useTransform` dari Framer Motion). Buat elemen dekoratif berupa bentuk SVG geometris (lingkaran putus-putus, kotak tidak sempurna) yang mengambang di latar belakang. Elemen latar ini harus bergerak berlawanan arah dengan pergerakan kursor mouse untuk menciptakan ilusi kedalaman 3D.
- Tambahkan efek batas bawah berupa `.torn-edge`.

### D. `About.jsx`
- **UI**: Tata letak grid 2 kolom. Kolom kiri: Teks deskripsi dengan *highlight* stabilo (background kuning pucat di belakang teks tertentu). Kolom kanan: Elemen bergaya foto Polaroid (`div` miring dengan *border* putih tebal dan bayangan) dengan sketsa ilustrasi di dalamnya.

### E. `Experience.jsx`
- **UI**: Desain mirip catatan sejarah yang ditarik dengan garis vertikal putus-putus (`border-dashed`). 
- **Animasi**: Setiap kartu pengalaman muncul dari samping (`x: -50`, `opacity: 0` ke `1`) saat di-*scroll* (gunakan `whileInView` dari Framer Motion).
- Kartu memiliki *background* putih transparan dengan rotasi acak (`rotate-1` atau `-rotate-1`).

### F. `Footer.jsx`
- **UI**: Dibatasi dengan garis atas putus-putus seperti area sobekan (`border-t-2 border-dashed border-gray-400`).
- Teks penutup: "Digambar dengan ☕ dan Kode." Tautan ke GitHub/LinkedIn dengan *hover* tebal.

## 5. Instruksi Eksekusi (`App.jsx`)
- Rakit semua komponen di atas di dalam `App.jsx`.
- Gunakan `useState` dan `useEffect` untuk mengontrol rendering `<Preloader />`.
- Bungkus semua rute komponen di dalam `<motion.div>` yang akan *fade-in* setelah preloader selesai.
- Berikan jarak (`gap` atau `margin-bottom`) antar komponen yang cukup besar (misal: `py-24`) agar terasa seperti halaman buku sketsa yang luas.

---
**Perintah Eksekusi Agen:**
"Tolong mulai dengan men-*generate* `index.css` beserta konfigurasi Tailwind dan tekstur SVG-nya, kemudian lanjutkan ke `App.jsx` dan pembuatan masing-masing komponen di folder `components/` secara berurutan sesuai pedoman estetika di atas."