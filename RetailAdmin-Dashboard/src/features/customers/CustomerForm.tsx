import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
} from '@mui/material';
import type { User } from '../../types';

interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    website: string;
}

interface CustomerFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CustomerFormData) => void;
    customer?: User | null;
    isEditing?: boolean;
}

const CustomerForm = ({
    open,
    onClose,
    onSubmit,
    customer,
    isEditing = false
}: CustomerFormProps) => {
    const [formData, setFormData] = useState<CustomerFormData>({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        company: customer?.company?.name || '',
        website: customer?.website || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!formData.name || !formData.email}
                >
                    {isEditing ? 'Save Changes' : 'Add Customer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerForm;
