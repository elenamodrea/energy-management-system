import React, {useState} from 'react'
import { Grid,Paper, Avatar, TextField, Button, Typography,Link } from '@material-ui/core'
import LoginIcon from '@mui/icons-material/Login';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

const Login=({history})=>{

    const paperStyle={padding :60,height:'70vh',width:500, backgroundColor:'#E3F3F8',borderRadius: '10px',}
    const avatarStyle={backgroundColor:'#B2D9E6'}
    const btnstyle={margin:'8px 0', backgroundColor: '#b2d9e6', borderRadius: '20px', marginTop: '20px', }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const spacingStyle = {
        marginTop: '20px',
    };
    const centerStyle = {
        background: 'linear-gradient(135deg, #B2D9E6, #E6F3F7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    };
    const handleLogin = async () => {
        // You should validate email and password here before making the request
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/login', {
                email: email,
                password: password,
            });
            const token = response.data;
            sessionStorage.setItem('token', token);
            console.log(sessionStorage.getItem('token')); // Log the token here
            try {
              //  const encodedEmail = encodeURIComponent(email); // This encodes the "@" symbol

                const responseGet = await axios.get(`http://localhost:8080/person/${email}`,
                    {
                        headers: {
                            Authorization: token,

                        },
                    });

                sessionStorage.setItem('role', responseGet.data.role);
                sessionStorage.setItem('email', responseGet.data.email);
                sessionStorage.setItem('name', responseGet.data.name);
                sessionStorage.setItem('accessedBefore', 'true');
                console.log(sessionStorage.getItem('role')); // Log the token here
                console.log(sessionStorage.getItem('email')); // Log the token here
                if(sessionStorage.getItem('role') === 'ADMIN'){
                    history.push('/admin');
                }
                else{
                    history.push('/client');
                }
            } catch (error) {
                console.error('Get error:', error);
                alert('An error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return(
        <div style={centerStyle}>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LoginIcon/></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <TextField label='Email' placeholder='Enter email' fullWidth required onChange={(e) => setEmail(e.target.value)}/>
                <TextField label='Password' placeholder='Enter password' type='password' fullWidth required onChange={(e) => setPassword(e.target.value)}/>

                <Button type='submit' variant="contained" style={btnstyle} fullWidth  onClick={handleLogin}>Sign in</Button>
                <Typography  style={spacingStyle} > Do you have an account ?
                    <Link href="#" onClick={() => history.push('/register')}>
                         Sign Up
                    </Link>
                </Typography>
            </Paper>
        </div>
    )
}

export default withRouter(Login);