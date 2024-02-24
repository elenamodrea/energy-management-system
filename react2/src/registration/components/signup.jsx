import React from 'react'
import {
    Grid,
    Paper,
    Avatar,
    TextField,
    Button,
    FormLabel,
    FormControl,
    RadioGroup, FormControlLabel, Radio
} from '@material-ui/core'
import LoupeIcon from '@mui/icons-material/Loupe';
import  { useState } from 'react';
import {withRouter} from "react-router-dom";
import axios from "axios";

const SignUp=({history})=>{

    const paperStyle={padding :60,height:'85vh',width:500, backgroundColor:'#E3F3F8',borderRadius: '10px',}
    const avatarStyle={backgroundColor:'#B2D9E6'}
    const btnstyle={margin:'8px 0', backgroundColor: '#b2d9e6', borderRadius: '20px', marginTop: '20px', }
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

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('CLIENT');
    const [passwordError, setPasswordError] = useState('');
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  //  const [requiredFieldsComplete, setRequiredFieldsComplete] = useState(false);
    const handleChangeName= (event) => {
        setUserName(event.target.value);

    };
    const handleRoleChange = (event) => {
        setRole(event.target.value); // Update the selectedValue when a radio button is clicked
    };
    const validatePassword = (value) => {
        const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return strongPasswordRegex.test(value);
    };

    const handleChangePassword = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        setPasswordsMatch(newPassword === confirmPassword);
        if (!validatePassword(newPassword)) {
            setPasswordError('Password must contain at least 1 capital letter, 1 number, and be at least 8 characters long.');
        } else {
            setPasswordError('');
        }
    };
    const handleChangeConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
        setPasswordsMatch(event.target.value === password);
    };
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        // Check if the email format is valid
        if (!emailRegex.test(newEmail)) {
            setEmailError('Invalid email format!');
        } else {
            setEmailError('');
        }
    };
    const allRequiredFieldsComplete =
        userName.trim() !== '' &&
        email.trim() !== '' &&
        password.trim() !== '' &&
        confirmPassword.trim() !== '' &&
        passwordsMatch &&
        emailError.length === 0;

    const handleSignUp = async() => {
        if (allRequiredFieldsComplete) {
            try{
                const response = await axios.post('http://localhost:8080/register', {
                    name: userName,
                    email: email,
                    password: password,
                    role: role,
                });
                history.push('/login');
            } catch (error) {
                console.error('Get error:', error);
                alert('An error occurred. Please try again later.');
            }

        }
    };

    return(
        <div style={centerStyle}>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LoupeIcon/></Avatar>
                    <h2>Sign Up</h2>
                </Grid>
                <TextField label='Name'
                           placeholder='Enter name'
                           fullWidth
                           required
                           value={userName}
                           onChange={handleChangeName}
                />
                <TextField label='Email'
                           placeholder='Enter email'
                           fullWidth
                           required
                           value={email}
                           onChange={handleEmailChange}
                           error={emailError.length > 0}
                           helperText={emailError}
                />
                <TextField label='Password'
                           placeholder='Enter password'
                           type='password'
                           fullWidth
                           required
                           value={password}
                           error={passwordError.length > 0}
                           helperText={passwordError}
                           onChange={handleChangePassword}
                />
                <TextField label='Confirm Password'
                           placeholder='Confirm your password'
                           type='password'
                           fullWidth
                           required
                           value={confirmPassword}
                           onChange={handleChangeConfirmPassword}
                />
                {passwordsMatch === false && (
                    <p style={{ color: 'red' }}>Passwords do not match!</p>
                )}
                <FormControl style={spacingStyle}>
                    <FormLabel id="gender-radio-group">Role</FormLabel>
                    <RadioGroup
                        aria-labelledby="gender-radio-group-label"
                        defaultValue="CLIENT"
                        name="gender-radio-buttons-group"
                        style={{ display: 'initial' }}
                        onChange={handleRoleChange}
                        required
                    >
                        <FormControlLabel value="CLIENT" control={<Radio color = {'default'}/>} label="CLIENT" labelPlacement="end"  style={{ fontSize: "10px" }} />
                        <FormControlLabel value="ADMIN" control={<Radio color = {'default'}/>} label="ADMIN" labelPlacement="end"  style={{ fontSize: "14px" }} />
                    </RadioGroup>
                </FormControl>
                {!allRequiredFieldsComplete && (
                    <p style={{ color: 'red' }}>Not all required fields are complete!</p>
                )}
                <Button type='submit'
                        variant="contained"
                        style={btnstyle}
                        fullWidth
                        onClick = {handleSignUp}
                >Sign up</Button>

            </Paper>
        </div>
    )
}

export default withRouter(SignUp);