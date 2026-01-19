import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
    Paper,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../../services/api';
import { setCustomers, addCustomer, updateCustomer, deleteCustomer, setSelectedCustomer } from './customerSlice';
import { LoadingSpinner } from '../../components';
import type { User } from '../../types';

interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    website: string;
}

const initialFormData: CustomerFormData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
};

const CustomersPage = () => {
    const dispatch = useAppDispatch();
    const { customers, selectedCustomer } = useAppSelector((state) => state.customers);
    const { data: usersData, isLoading, refetch } = useGetUsersQuery();

    const [createUserMutation] = useCreateUserMutation();
    const [updateUserMutation] = useUpdateUserMutation();
    const [deleteUserMutation] = useDeleteUserMutation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<User | null>(null);

    useEffect(() => {
        if (usersData && customers.length === 0) {
            dispatch(setCustomers(usersData));
        }
    }, [usersData, dispatch, customers.length]);

    const handleOpenDialog = (customer?: User) => {
        if (customer) {
            setIsEditing(true);
            dispatch(setSelectedCustomer(customer));
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                company: customer.company.name,
                website: customer.website,
            });
        } else {
            setIsEditing(false);
            dispatch(setSelectedCustomer(null));
            setFormData(initialFormData);
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setFormData(initialFormData);
        dispatch(setSelectedCustomer(null));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const userData: Partial<User> = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            username: formData.name.toLowerCase().replace(/\s/g, ''),
            website: formData.website,
            company: {
                name: formData.company,
                catchPhrase: '',
                bs: '',
            },
            address: {
                street: '',
                suite: '',
                city: '',
                zipcode: '',
                geo: { lat: '', lng: '' },
            },
        };

        if (isEditing && selectedCustomer) {
            await updateUserMutation({ id: selectedCustomer.id, ...userData });
            dispatch(updateCustomer({ ...selectedCustomer, ...userData } as User));
        } else {
            const result = await createUserMutation(userData);
            if ('data' in result && result.data) {
                dispatch(addCustomer({ ...userData, id: result.data.id } as User));
            }
        }

        handleCloseDialog();
    };

    const handleDeleteClick = (customer: User) => {
        setCustomerToDelete(customer);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (customerToDelete) {
            await deleteUserMutation(customerToDelete.id);
            dispatch(deleteCustomer(customerToDelete.id));
        }
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
        {
            field: 'company',
            headerName: 'Company',
            flex: 1,
            minWidth: 150,
            valueGetter: (_, row) => row.company?.name || '',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleOpenDialog(params.row)}
                    color="primary"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteClick(params.row)}
                />,
            ],
        },
    ];

    if (isLoading && customers.length === 0) {
        return <LoadingSpinner message="Loading customers..." />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Customers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your customer database
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => refetch()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    >
                        Add Customer
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ height: 600, borderRadius: 3, overflow: 'hidden' }}>
                <DataGrid
                    rows={customers}
                    columns={columns}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'grey.100',
                        },
                    }}
                />
            </Paper>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={600}>
                    {isEditing ? 'Edit Customer' : 'Add New Customer'}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            name="name"
                            label="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            name="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            name="phone"
                            label="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            name="company"
                            label="Company"
                            value={formData.company}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            name="website"
                            label="Website"
                            value={formData.website}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.email}
                    >
                        {isEditing ? 'Save Changes' : 'Add Customer'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle fontWeight={600}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>{customerToDelete?.name}</strong>?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomersPage;
