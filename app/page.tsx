import Image from "next/image";
import { Navbar } from "./components/marketing/Navbar";
import { Hero } from "./components/marketing/Hero";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
    </main>
  );
}
