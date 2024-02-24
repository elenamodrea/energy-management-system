import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import axios from "axios";

function DeviceComponent({
                            deviceId,
                            description,
                            address,
                            consumption,
                            isClient,
                             onSelectDevice,
                            userEmail,
                             onDeleteDevice,
                             onClick,
                         }) {
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const token = sessionStorage.getItem('token');
    const [showEnergyConsumption, setShowEnergyConsumption] = useState(false); // Track visibility of EnergyConsumption

    const textStyle = {
        color: isHovered ? 'black' : 'white',
        transition: 'color 0.3s',
    };
    function handleMouseOver() {
        setIsHovered(true);
    }

    function handleMouseOut() {
        setIsHovered(false);
    }
    const handleClick = (event) => {
       if(!isClient) {
           if (anchorEl) {
               setAnchorEl(null); // Close the menu if it's already open
           } else {
               setAnchorEl(event.currentTarget); // Open the menu
           }
       }
       else{
           onClick(deviceId);
       }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        onSelectDevice(deviceId);
    };
    const handleDeleteDevice = async(event) => {
        event.preventDefault();


        try{
            const response = await axios.delete(`http://localhost:8081/device/${deviceId}`,{
                headers: {
                    Authorization: token,

                },
            });
            onDeleteDevice(deviceId);
            console.log("Device deleted successfully!");
            onDeleteDevice(deviceId);

        } catch (error) {
            console.error('Get error:', error);

        }


    };
    return (
        <Card
            sx={{
                height: 250,
                width: 'calc(25% - 10px)',
                margin: 5,
                borderRadius: 10,
                boxShadow: 20,
                background: '#4F96AD',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={handleClick}
        >
            <CardActionArea>

                <CardContent >
                    <Typography gutterBottom variant='h5' component='div'>
                        <div className='description' style={textStyle}>
                           Description: {description}
                        </div>
                    </Typography>

                    <Typography gutterBottom variant='h6' color='text.secondary'>
                        <div className='address' style={textStyle}>
                           Address:  {address}
                        </div>
                    </Typography>

                    <Typography gutterBottom variant='h6' color='text.secondary'>
                        <div className='consumption' style={textStyle}>
                           Consumption:  {consumption}
                        </div>
                    </Typography>
                    {!isClient && (<Typography gutterBottom variant='h6' color='text.secondary'>
                        <div className='userEmail' style={textStyle}>
                            userEmail:  {userEmail}
                        </div>
                    </Typography>
                        )}
                </CardContent>
            </CardActionArea>
            { !isClient && (<Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                color = '#D9EAF4'
            >
                <MenuItem onClick={handleEdit}>Update Device</MenuItem>
                <MenuItem onClick={handleDeleteDevice}>Delete Device</MenuItem>
            </Menu>
                )}
        </Card>
    );
}


export default DeviceComponent;
