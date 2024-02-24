/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import icon from '../../commons/images/icon.svg';
import axios from "axios";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@material-ui/core";
const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto; /* Center horizontally */
  padding: 10px;
  border: 1px solid #4F96AD;
  background-color: #8ac3d7;
  border-radius: 10px;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
`;

const FormGroup = styled.div`
  margin-bottom: 50px;
  margin-right: 25px;
`;

const Label = styled.label`
  font-weight: bold;
  color: black;
  margin-right: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #8d5fb8;
  border-radius: 10px;
  &::placeholder {
    font-weight: bold; /* Fix the typo here */
    color: white;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 18px;
  background-color: #4F96AD;
  color: #fff;
  border: none;
  cursor: pointer;
`;
const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;
const Message = styled.p`
  margin-top: 10px;
  color: green;
  font-size: 16px;
`;

const globalStyles = css`
  body {
    background: radial-gradient(circle, rgba(244,224,240,1) 6%, rgba(211,151,235,1) 100%);
`;



const AddPerson = () => {

    const [personSaveDTO, setPersonSaveDTO] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
    });
    const spacingStyle = {
        marginTop: '-10px',
    };
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CLIENT');
    const token = sessionStorage.getItem('token');
    const allRequiredFieldsComplete =
        name.trim() !== '' &&
        email.trim() !== '' &&
        password.trim() !== 0 &&
        role.trim() !== '' ;
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPersonSaveDTO((prevPersonSaveDTO) => ({
            ...prevPersonSaveDTO,
            [name]: value,
        }));

        if (name === 'email') {
            setEmailError(validateEmail(value));
        } else if (name === 'password') {
            setPasswordError(validatePassword(value));
        }
    };

    const handleAddPerson = async(event) => {
        console.log(name,email,password,role);
        event.preventDefault();
        if (validateEmail(email)) {
            setEmailError('Invalid email format');
            return;
        } else {
            setEmailError('');
        }

        if (validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters');
            return;
        } else {
            setPasswordError('');
        }
        if (allRequiredFieldsComplete) {
            try{
                const response = await axios.post('http://localhost:8080/person', {
                    name: name,
                    email: email,
                    password: password,
                    role: role,
                },{
                    headers: {
                        Authorization: token,

                    },
                });
                setMessage("Person created!");
            } catch (error) {
                console.error('Get error:', error);
                alert('An error occurred. Please try again later.');
            }

        }

    };
    const validateEmail = (email) => {
        // This is a basic email validation, you can use a more complex regex if needed
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailPattern.test(email) ? '' : 'Invalid email format';
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordPattern.test(password)
            ? ''
            : 'Password must be at least 8 characters, with at least 1 capital letter, and at least 1 digit';

    };


  /*  const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = personSaveDTO;

        if (!validateEmail(email)) {
            setEmailError('Invalid email format');
            return;
        } else {
            setEmailError('');
        }

        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters');
            return;
        } else {
            setPasswordError('');
        }

        // If both email and password are valid, you can submit the form or show a success message
        setMessage('Form submitted successfully');
    };*/
        const showMessage = (message) => {
            setMessage(message);
            setTimeout(() => {
                setMessage('');
            }, 5000);
        };


        const handleTabKeyPress = (event) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                const formElements = event.target.form.elements;
                const currentIndex = Array.from(formElements).indexOf(event.target);
                const nextElement = formElements[currentIndex + 1];
                if (nextElement) {
                    nextElement.focus();
                }
            }
        };

        return (
            <>

                <Global styles={globalStyles}/>
                <FormContainer>
                    <form >
                        <FormGroup>
                            <Label>Name</Label>
                            <Input
                                type='text'
                                name='name'
                                placeholder='Enter the name of the person'

                                onChange={(e) => setName(e.target.value)}

                                onKeyDown={handleTabKeyPress}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type='text'
                                name='email'
                                placeholder='Enter the email of the person '

                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleTabKeyPress}
                            />
                            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type='password'
                                name='password'
                                placeholder='Enter the password of the person account'

                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleTabKeyPress}
                            />
                            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                        </FormGroup>
                        <FormControl style={spacingStyle}>
                            <FormLabel id="gender-radio-group">Role</FormLabel>
                            <RadioGroup
                                aria-labelledby="gender-radio-group-label"
                                defaultValue="CLIENT"
                                name="gender-radio-buttons-group"
                                style={{ display: 'initial' }}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <FormControlLabel value="CLIENT" control={<Radio color = {'default'}/>} label="CLIENT" labelPlacement="end"  style={{ fontSize: "10px" }} />
                                <FormControlLabel value="ADMIN" control={<Radio color = {'default'}/>} label="ADMIN" labelPlacement="end"  style={{ fontSize: "14px" }} />
                            </RadioGroup>
                        </FormControl>
                        <Button type='submit' onClick={handleAddPerson}>Add Person</Button>
                    </form>
                    {message && <Message>{message}</Message>}
                </FormContainer>
            </>
        );
    };

export default AddPerson;
