import "./globals.css";
import Providers from "./providers";
import Link from "next/link";
import WalletConnectButton from "@/components/WalletConnectButton";

export const metadata = { title: "WomenX" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Providers>
          <header className="header">
            <nav className="nav container">
              <Link href="/" className="brand">WomenX</Link>
              <div className="links">
                <Link href="/opportunities" className="link">Opportunities</Link>
                <Link href="/opportunities/new" className="link">Post</Link>
                <WalletConnectButton />
              </div>
            </nav>
          </header>
          <main className="container">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
