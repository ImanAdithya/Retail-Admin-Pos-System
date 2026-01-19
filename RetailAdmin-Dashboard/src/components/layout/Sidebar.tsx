import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Avatar,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Inventory as InventoryIcon,
    PointOfSale as POSIcon,
    Logout as LogoutIcon,
    Store as StoreIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

interface SidebarProps {
    drawerWidth: number;
    mobileOpen: boolean;
    onDrawerToggle: () => void;
    isMobile: boolean;
}

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    { text: 'Point of Sale', icon: <POSIcon />, path: '/pos' },
];

const Sidebar = ({ drawerWidth, mobileOpen, onDrawerToggle, isMobile }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            onDrawerToggle();
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    color: 'white',
                }}
            >
                <StoreIcon sx={{ fontSize: 40 }} />
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        RetailAdmin
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Dashboard
                    </Typography>
                </Box>
            </Box>

            {user && (
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                        {user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                            {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {user.email}
                        </Typography>
                    </Box>
                </Box>
            )}

            <Divider />

            <List sx={{ flex: 1, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ px: 1, mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 44,
                                    color: location.pathname === item.path ? 'inherit' : 'primary.main',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />


            <List sx={{ p: 1 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            color: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.dark',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{ fontWeight: 500 }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
