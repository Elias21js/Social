import type { Metadata } from "next";
import "./globals.css";
import { HeaderWrapper } from "./components/header/HeaderWrapper";

export const metadata: Metadata = {
  title: "Social • Sua Rede Privada",
  description: "Conecte-se com amigos e compartilhe momentos de forma privada e segura.",
  keywords: ["rede social", "privacidade", "amizade", "posts", "interação"],
  authors: [{ name: "Souza", url: "https://seusite.com" }],
  openGraph: {
    title: "Social • Sua Rede Privada",
    description: "Conecte-se com amigos e compartilhe momentos de forma privada e segura.",
    url: "https://seusite.com/social",
    siteName: "Social",
    images: [
      {
        url: "https://seusite.com/social/og-image.png",
        width: 1200,
        height: 630,
        alt: "Social - rede social privada",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social • Sua Rede Privada",
    description: "Conecte-se com amigos e compartilhe momentos de forma privada e segura.",
    images: ["https://seusite.com/social/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <HeaderWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
