import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Badge,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ShoppingCart as CartIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { selectCartItemCount } from '../../features/pos/cartSlice';

interface HeaderProps {
    drawerWidth: number;
    onDrawerToggle: () => void;
}

const Header = ({ drawerWidth, onDrawerToggle }: HeaderProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const cartItemCount = useAppSelector(selectCartItemCount);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleMenuClose();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                backgroundColor: 'white',
                color: 'text.primary',
            }}
            elevation={0}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>

                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/pos')}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                            }
                        }}
                    >
                        <Badge badgeContent={cartItemCount} color="error">
                            <CartIcon />
                        </Badge>
                    </IconButton>

                    <IconButton
                        color="inherit"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                            }
                        }}
                    >
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 36,
                                height: 36,
                                fontSize: '0.9rem',
                            }}
                        >
                            {user?.name.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 200,
                                borderRadius: 2,
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => navigate('/')}>Dashboard</MenuItem>
                        <MenuItem onClick={() => navigate('/customers')}>Customers</MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
