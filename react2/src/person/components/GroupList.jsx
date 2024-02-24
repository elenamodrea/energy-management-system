import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import { Button } from "@material-ui/core";
import axios from "axios";

export default function GroupList() {
    const [checked, setChecked] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleConfirm = () => {
        // Add your logic to handle the confirmed selection
        console.log('Confirmed selection:', checked);
    };

    React.useEffect(() => {
        const getPersons = async () => {
            try {
                const responseGet = await axios.get(`http://localhost:8080/person`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token'),
                    },
                });
                const allUsers = responseGet.data;
                const clientUsers = allUsers.filter(user => user.role === 'CLIENT');
                setUsers(clientUsers);
            } catch (error) {
                console.error('Get error:', error);
                alert('An error occurred on getting person details. Please try again later.');
            }
        };

        getPersons(); // Fetch data when the component mounts
    }, []); // Empty dependency array ensures the effect runs once on mount

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {users.map((user, index) => {
                    const labelId = `checkbox-list-secondary-label-${index}`;
                    return (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    onChange={handleToggle(index)}
                                    checked={checked.indexOf(index) !== -1}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`Avatar ${index + 1}`}
                                        src={`/static/images/avatar/${index + 1}.jpg`}
                                    />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={user.name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Button onClick={handleConfirm}><CheckIcon /> </Button>
        </div>
    );
}
