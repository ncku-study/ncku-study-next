'use client';

import React from 'react';
import NavLayout from '@/components/layout/NavLayout';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavLayout>{children}</NavLayout>;
}
