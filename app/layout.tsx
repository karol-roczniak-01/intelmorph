import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Inter } from 'next/font/google'

export const metadata = {
  title: "Intelmorph",
  description: "The best way to publish your research",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-screen`} suppressHydrationWarning>
      <body className="bg-background text-foreground w-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}