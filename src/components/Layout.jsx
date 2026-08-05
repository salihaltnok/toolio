import React from "react";

const Layout = ({ children }) => {
  return (
    // Navbar ve Footer App.jsx'te olduğu için burası sadece içerik kutusudur.
    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  );
};

export default Layout;
