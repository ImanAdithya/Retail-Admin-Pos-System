import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import {
    Email as EmailIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Store as StoreIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser, clearError } from './authSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            dispatch(loginUser(email.trim()));
        }
    };

    const validEmails = [
        'Sincere@april.biz',
        'Shanna@melissa.tv',
        'Nathan@yesenia.net',
        'Julianne.OConner@kory.org',
        'Lucio_Hettinger@annie.ca',
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: 440,
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 4,
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                mb: 2,
                            }}
                        >
                            <StoreIcon sx={{ fontSize: 48 }} />
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="primary.main">
                            RetailAdmin
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign in to your dashboard
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            sx={{ mb: 3 }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={isLoading || !email.trim()}
                            sx={{
                                py: 1.5,
                                mb: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontSize: '1rem',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                },
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                    
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => setShowHint(!showHint)}
                            endIcon={showHint ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        >
                            {showHint ? 'Hide' : 'Show'} Demo Accounts
                        </Button>

                        {showHint && (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    backgroundColor: 'grey.100',
                                    borderRadius: 2,
                                    textAlign: 'left',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                    Use any of these emails to login:
                                </Typography>
                                {validEmails.map((validEmail) => (
                                    <Typography
                                        key={validEmail}
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'monospace',
                                            cursor: 'pointer',
                                            py: 0.5,
                                            '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: 'primary.light',
                                                borderRadius: 1,
                                                px: 1,
                                                mx: -1,
                                            },
                                        }}
                                        onClick={() => setEmail(validEmail)}
                                    >
                                        {validEmail}
                                    </Typography>
                                ))}
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
