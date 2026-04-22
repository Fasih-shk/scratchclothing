'use client';

import React from 'react';
import { FrappeProvider } from 'frappe-react-sdk';

export function FrappeAppProvider({ children }) {
  // Replace with your actual Frappe/ERPNext URL
  const url = process.env.NEXT_PUBLIC_FRAPPE_URL || 'http://localhost:8000';

  return (
    <FrappeProvider url={url}>
      {children}
    </FrappeProvider>
  );
}
