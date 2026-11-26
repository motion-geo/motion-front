import type { Metadata } from "next";
import { Alatsi, Noto_Sans_Georgian } from "next/font/google";
import { AuthProvider } from "@/components/auth";
import { BrandHead } from "@/components/brand-head";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LocaleProvider } from "@/components/locale";
import { ThemeProvider, themeInitScript } from "@/components/theme";
import { ThemeInitScript } from "@/components/theme-init-script";
import { apiFetchSettings, mediaUrl } from "@/lib/api";
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

const fallbackMeta = {
  title: "Motion · Vision in Action",
  description:
    "Motion is a digital marketing agency. Strategy, design, content, and advertising in one system.",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await apiFetchSettings();
    const favicon = mediaUrl(settings.faviconPath);
    const og = mediaUrl(settings.ogImagePath);
    return {
      title: fallbackMeta.title,
      description: fallbackMeta.description,
      robots: { index: false, follow: false },
      icons: favicon ? { icon: favicon } : undefined,
      openGraph: {
        title: fallbackMeta.title,
        description: fallbackMeta.description,
        images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
      },
      twitter: og
        ? {
            card: "summary_large_image",
            images: [og],
          }
        : undefined,
    };
  } catch {
    return {
      ...fallbackMeta,
      robots: { index: false, follow: false },
    };
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ka"
      data-theme="noir"
      data-scroll-behavior="smooth"
      className={`${noto.variable} ${alatsi.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeInitScript html={themeInitScript} />
      </head>
      <body className="flex min-h-full flex-col bg-page font-sans text-page-fg">
        <LocaleProvider>
          <ThemeProvider>
            <AuthProvider>
              <BrandHead />
              <Header />
              <main className="flex-1 pt-16 sm:pt-[4.5rem]">{children}</main>
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
