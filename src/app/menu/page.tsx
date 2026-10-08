import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MenuView from "./MenuView";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <>
      <Nav />
      <main>
        <MenuView />
      </main>
      <Footer />
    </>
  );
}
