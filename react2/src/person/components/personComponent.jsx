import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import axios from "axios";

function PersonComponent({   name,
                             email,
                             role,
                             isClient,
                             onSelectPerson,
                             onDeletePerson
                         }) {
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const token = sessionStorage.getItem('token');


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
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        onSelectPerson(email);
    };
    const handleDeletePerson = async(event) => {
        event.preventDefault();


        try{
            const response = await axios.delete(`http://localhost:8080/person/${email}`,{
                headers: {
                    Authorization: token,

                },
            });

            console.log("Person deleted successfully!");
            onDeletePerson(email);

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
                        <div className='name' style={textStyle}>
                            Name: {name}
                        </div>
                    </Typography>

                    <Typography gutterBottom variant='h6' color='text.secondary'>
                        <div className='email' style={textStyle}>
                            Email:  {email}
                        </div>
                    </Typography>
                    <Typography gutterBottom variant='h6' color='text.secondary'>
                        <div className='role' style={textStyle}>
                            Role:  {role}
                        </div>
                    </Typography>
                </CardContent>
            </CardActionArea>
           <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    color = '#D9EAF4'
                >
                    <MenuItem onClick={handleEdit}>Update Person</MenuItem>
                    <MenuItem onClick={handleDeletePerson}>Delete Person</MenuItem>
                </Menu>

        </Card>
    );
}


export default PersonComponent;
