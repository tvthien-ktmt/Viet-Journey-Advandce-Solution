import React from 'react';
import { Outlet } from 'react-router-dom';
import { RootLayout } from './RootLayout';

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <RootLayout />
      {children}
    </>
  );
}
