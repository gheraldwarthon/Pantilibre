import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E05D84', // Elegant rose pink
      light: '#FCE7F3',
      dark: '#BE185D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#D4AF37', // Pantilibre Champagne Gold
      light: '#F5DE98',
      dark: '#A67C1A',
      contrastText: '#2D1822',
    },
    background: {
      default: '#FFF8F9', // Light soft blush pink background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D1822', // High readability deep plum charcoal
      secondary: '#7A5868', // Muted rose
    },
    divider: '#FCE7F3',
  },
  typography: {
    fontFamily: "'Outfit', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px -2px rgba(224, 93, 132, 0.25)',
          },
        },
        contained: ({ ownerState }) => ({
          ...(ownerState.color === 'primary' && {
            background: 'linear-gradient(135deg, #EC4899 0%, #E05D84 50%, #DB2777 100%)',
            color: '#FFFFFF',
          }),
          ...(ownerState.color === 'secondary' && {
            background: 'linear-gradient(135deg, #F5DE98 0%, #D4AF37 50%, #B88B22 100%)',
            color: '#2D1822',
            fontWeight: 700,
          }),
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: '1px solid #FCE7F3',
          boxShadow: '0 4px 20px -2px rgba(224, 93, 132, 0.06)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            borderColor: '#FBCFE8',
            boxShadow: '0 10px 25px -4px rgba(224, 93, 132, 0.14)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          border: '1px solid #FCE7F3',
          boxShadow: '0 20px 45px -10px rgba(224, 93, 132, 0.18)',
        },
      },
    },
  },
});
