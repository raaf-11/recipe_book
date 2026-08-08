import React from 'react';
import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />

      <main>
        {children}
      </main>
    </div>
  );
}