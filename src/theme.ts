import { createTheme } from '@mui/material/styles';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

const theme = createTheme({
  palette: {
    primary: {
      main: '#b53f3f', // Red hue based on #3f51b5
      light: '#e57373',
      dark: '#b53f3f',
      contrastText: '#fff',
    },
    secondary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    // Custom color for the premium card background
    premiumBackground: {
      main: '#E8EAF6', // Light purple-grey from the image
    },
  },
  typography: {
    fontFamily: `${dmSans.style.fontFamily}, sans-serif`,
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for cards
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    premiumBackground: Palette['primary'];
  }
  interface PaletteOptions {
    premiumBackground: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    premiumBackground: true;
  }
}

export default theme; 