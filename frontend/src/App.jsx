import React, { useState, useEffect } from "react";
import AppRoutes from "./app/AppRoutes";
import Providers from "./app/Providers";
import AuthModal from "./components/auth/AuthModal";
import { NevigationToTop } from "./hooks/scrollToTop";

const App = () => {
  return (
    <Providers>
      <NevigationToTop />
      <AppRoutes />
      <AuthModal />
    </Providers>
  );
};

export default App;
