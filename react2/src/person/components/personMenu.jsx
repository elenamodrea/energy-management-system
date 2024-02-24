import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PortraitIcon from '@mui/icons-material/Portrait';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import CreateAlbumForm from "./addPerson";

export default function PersonMenu({openAddPersonForm,openViewPersons} ) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMainClick = (event) => {
        setAnchorEl(event.currentTarget);
    };



    const handleClose = () => {
        setAnchorEl(null);

    };
    const handleAddPerson = () =>{
        openAddPersonForm();
        handleClose();
    }

    const handleViewPersons = () =>{
        openViewPersons();
        handleClose();
    }

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Person">
                <IconButton
                    onClick={handleMainClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls="account-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <PersonIcon sx={{ width: 32, height: 32 }}>Elena</PersonIcon>
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
                <MenuItem onClick={handleAddPerson}>
                    <PersonAddIcon /> Add Person
                </MenuItem>
                <MenuItem onClick={handleViewPersons}>
                    <EditIcon /> View Persons
                </MenuItem>


            </Menu>

        </Box>
    );
}
