import { Kalam } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Portofolio Nicholas",
  description: "Portofolio Nicholas Ivan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${kalam.className} antialiased selection:bg-yellow-200 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}