import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import PortraitIcon from '@mui/icons-material/Portrait';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {withRouter} from "react-router-dom";

 function AccountMenu({history}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleMainClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClick = () => {
        setProfileMenuOpen(!profileMenuOpen);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setProfileMenuOpen(false);
    };
    const handleLogout = () => {
        history.push('/login');
    };
    const open = Boolean(anchorEl);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleMainClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls="account-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <PortraitIcon sx={{ width: 32, height: 32 }}>Elena</PortraitIcon>
                    <ArrowDropDownIcon /> {/* Add the arrow indicator */}
                </IconButton>
            </Tooltip>

            {profileMenuOpen && (
                <Menu
                    anchorEl={anchorEl}
                    open={profileMenuOpen}
                    onClose={handleProfileClick}
                    PaperProps={{
                        sx: {
                            mt: 6,
                            ml: -16,
                            minWidth: '200px',
                            paddingLeft: '16px',
                            paddingRight: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #ccc',
                        },
                    }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                >
                    <MenuItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar />
                        <div>
                            <div>Name: {sessionStorage.getItem('name')}</div>
                            <div>Email: {sessionStorage.getItem('email')}</div>
                        </div>
                    </MenuItem>
                </Menu>
            )}

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
                <MenuItem onClick={handleProfileClick}>
                    <Avatar /> Profile
                </MenuItem>

                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
}
export default withRouter(AccountMenu);
