import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DevicesIcon from '@mui/icons-material/Devices';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
export default function DeviceMenu({openAddDeviceForm, openViewDevices}) {
    const [anchorEl, setAnchorEl] = useState(null);


    const handleMainClick = (event) => {
        setAnchorEl(event.currentTarget);
    };



    const handleClose = () => {
        setAnchorEl(null);

    };
    const handleAddDevice = () =>{
        openAddDeviceForm();
        handleClose();
    }
    const handleViewDevice = () =>{
        openViewDevices();
        handleClose();
    }
    const open = Boolean(anchorEl);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Device">
                <IconButton
                    onClick={handleMainClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls="account-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <DevicesIcon sx={{ width: 32, height: 32 }}>Elena</DevicesIcon>
                    <ArrowDropDownIcon /> {/* Add the arrow indicator */}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleAddDevice}>
                    <AddToQueueIcon /> Add Device
                </MenuItem>
                <MenuItem onClick={handleViewDevice}>
                    <VisibilityIcon /> View Devices
                </MenuItem>

            </Menu>
        </Box>
    );
}
