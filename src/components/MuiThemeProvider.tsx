'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import React from 'react';

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
} 