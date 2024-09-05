import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF9800', // Orange
      contrastText: '#FFFFFF', // White text for primary
    },
    secondary: {
      main: '#FFFFFF', // White
      contrastText: '#FF9800', // Orange text for secondary
    },
    background: {
      default: '#FFFFFF', // White background
      paper: '#FFF3E0', // Light orange for paper components
    },
    text: {
      primary: '#FF9800', // Orange for primary text
      secondary: '#757575', // Grey for secondary text
    },
  },
  typography: {
    h1: {
      color: '#FF9800', // Orange headings
      fontWeight: 700,
    },
    h2: {
      color: '#FF9800',
      fontWeight: 700,
    },
    body1: {
      color: '#757575', // Grey body text
    },
    button: {
      color: '#FFFFFF', // White text on buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#E65100', // Darker orange on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF9F0', // Light orange for Paper components
        },
      },
    },
  },
});

export default theme;
