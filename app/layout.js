import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Load our fonts with proper fallbacks
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Set up page metadata
export const metadata = {
  title: "My Todo List",
  description: "A simple and beautiful todo list to keep track of your tasks",
};

// Root layout that wraps all pages
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Simple Todo List</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
