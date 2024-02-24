/* eslint-disable react/no-unknown-property */
import { useState } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import icon from '../../commons/images/icon.svg';
import axios from "axios";

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



const EditPerson = ({email, name,role,onUpdatePerson }) => {

    const [personSaveDTO, setPersonSaveDTO] = useState({
        name: name,
        email: email,
        password: '',
        role: role,
    });
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameForm, setNameForm] = useState(name);
    const [passwordForm, setPasswordForm] = useState('');
    const token = sessionStorage.getItem('token');


    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordPattern.test(password)
            ? ''
            : 'Password must be at least 8 characters, with at least 1 capital letter, and at least 1 digit';

    };



    const handleEditPerson = async(event) => {
        event.preventDefault();
       if(passwordForm!=='') {
           if (!validatePassword(passwordForm)) {
               setPasswordError('Password must be at least 6 characters');
               return;
           } else {
               setPasswordError('');
           }
       }

            try{
                const response = await axios.put('http://localhost:8080/person', {
                    name: nameForm,
                    email: email,
                    password: passwordForm,
                    role: role,
                },{
                        headers: {
                            Authorization: token,

                        },
                });
                onUpdatePerson(email,nameForm);
                setMessage('Form submitted successfully');
            } catch (error) {
                console.error('Get error:', error);
                setMessage('Form was not submitted successfully');
            }


    };
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
                <form>
                    <FormGroup>
                        <Label>Name</Label>
                        <Input
                            type='text'
                            name='name'
                            placeholder='Enter the name of the person'
                            value={nameForm}
                            onChange={(e) => setNameForm(e.target.value)}
                            onKeyDown={handleTabKeyPress}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Password</Label>
                        <Input
                            type='password'
                            name='password'
                            placeholder='Enter the password of the person account'
                            value={passwordForm}
                            onChange={(e) => setPasswordForm(e.target.value)}
                            onKeyDown={handleTabKeyPress}
                        />
                        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                    </FormGroup>

                    <Button type='submit' onClick={handleEditPerson}>Edit Person</Button>
                </form>
                {message && <Message>{message}</Message>}
        </>
    );
};

export default EditPerson;
