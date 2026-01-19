import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
    message?: string;
    size?: number;
    fullScreen?: boolean;
}

const LoadingSpinner = ({
    message = 'Loading...',
    size = 48,
    fullScreen = false
}: LoadingSpinnerProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                ...(fullScreen && {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 9999,
                }),
                ...(!fullScreen && {
                    py: 8,
                }),
            }}
        >
            <CircularProgress
                size={size}
                sx={{
                    color: 'primary.main',
                }}
            />
            {message && (
                <Typography variant="body1" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default LoadingSpinner;
