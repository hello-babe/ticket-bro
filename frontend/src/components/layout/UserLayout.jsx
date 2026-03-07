import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
