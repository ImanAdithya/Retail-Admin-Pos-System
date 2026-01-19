import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00897b',
            light: '#4db6ac',
            dark: '#00695c',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ed6c02',
        },
        info: {
            main: '#0288d1',
        },
        success: {
            main: '#2e7d32',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0, 0, 0, 0.05)',
        '0px 4px 8px rgba(0, 0, 0, 0.08)',
        '0px 8px 16px rgba(0, 0, 0, 0.1)',
        '0px 12px 24px rgba(0, 0, 0, 0.12)',
        '0px 16px 32px rgba(0, 0, 0, 0.14)',
        '0px 20px 40px rgba(0, 0, 0, 0.16)',
        '0px 24px 48px rgba(0, 0, 0, 0.18)',
        '0px 28px 56px rgba(0, 0, 0, 0.2)',
        '0px 32px 64px rgba(0, 0, 0, 0.22)',
        '0px 36px 72px rgba(0, 0, 0, 0.24)',
        '0px 40px 80px rgba(0, 0, 0, 0.26)',
        '0px 44px 88px rgba(0, 0, 0, 0.28)',
        '0px 48px 96px rgba(0, 0, 0, 0.3)',
        '0px 52px 104px rgba(0, 0, 0, 0.32)',
        '0px 56px 112px rgba(0, 0, 0, 0.34)',
        '0px 60px 120px rgba(0, 0, 0, 0.36)',
        '0px 64px 128px rgba(0, 0, 0, 0.38)',
        '0px 68px 136px rgba(0, 0, 0, 0.4)',
        '0px 72px 144px rgba(0, 0, 0, 0.42)',
        '0px 76px 152px rgba(0, 0, 0, 0.44)',
        '0px 80px 160px rgba(0, 0, 0, 0.46)',
        '0px 84px 168px rgba(0, 0, 0, 0.48)',
        '0px 88px 176px rgba(0, 0, 0, 0.5)',
        '0px 92px 184px rgba(0, 0, 0, 0.52)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                },
                contained: {
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
                    },
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
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: '4px 0px 20px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
                },
            },
        },
    },
});

export default theme;
