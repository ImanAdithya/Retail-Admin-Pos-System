import { Box, Card, CardContent, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
    sx?: SxProps<Theme>;
}

const colorGradients = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    success: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    error: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
    info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
};

const StatsCard = ({ title, value, icon, trend, color = 'primary', sx }: StatsCardProps) => {
    return (
        <Card
            sx={{
                position: 'relative',
                overflow: 'hidden',
                ...sx,
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h3" fontWeight={700} color="text.primary">
                            {value}
                        </Typography>
                        {trend && (
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 1,
                                    color: trend.isPositive ? 'success.main' : 'error.main',
                                    fontWeight: 500,
                                }}
                            >
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                                <Typography component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                                    vs last month
                                </Typography>
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 3,
                            background: colorGradients[color],
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: colorGradients[color],
                }}
            />
        </Card>
    );
};

export default StatsCard;
