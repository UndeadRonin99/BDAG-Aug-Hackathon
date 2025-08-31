import "./globals.css";
import Providers from "./providers";
import Link from "next/link";
import WalletConnectButton from "@/components/WalletConnectButton";
import { AddBlockDAGButton } from "@/components/AddBlockDAGButton"; // <-- import

export const metadata = { title: "WomenX" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* fonts etc. */}</head>
      <body>
        <Providers>
          <header className="header">
            <nav className="nav container">
              <Link href="/" className="brand">WomenX</Link>
              <div className="links">
                <Link href="/opportunities" className="link">Opportunities</Link>
                <Link href="/opportunities/new" className="link">Post</Link>
                <AddBlockDAGButton />             {/* <-- here */}
                <WalletConnectButton />
              </div>
            </nav>
          </header>
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
