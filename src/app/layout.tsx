import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google';
import "./globals.css";
import Providers from '@/components/Providers';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Sync - Voice Standup Summarizer",
  description: "Transform your standup meetings with AI-powered voice-to-text and summarization",
  icons: {
    icon: '/sync.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
