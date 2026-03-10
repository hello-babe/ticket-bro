// frontend/src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

const MainLayout = () => {
  return (
    <div>
      <Header />
      <Navbar />
      {/* pb-16 xl:pb-0 — clears space for MobileBottomNav on mobile, removed on desktop */}
      <main className="min-h-screen pb-16 xl:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;