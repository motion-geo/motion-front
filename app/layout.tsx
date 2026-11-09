import type { Metadata } from "next";
import { Alatsi, Noto_Sans_Georgian } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LocaleProvider } from "@/components/locale";
import "./globals.css";

const noto = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
});

const alatsi = Alatsi({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alatsi",
});

export const metadata: Metadata = {
  title: "Motion · Vision in Action",
  description:
    "Motion is a digital marketing agency. Strategy, design, content, and advertising in one system.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ka"
      data-scroll-behavior="smooth"
      className={`${noto.variable} ${alatsi.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black font-sans text-white">
        <LocaleProvider>
          <Header />
          <main className="flex-1 pt-[4.5rem]">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
