/* eslint-disable react/no-unknown-property */
import {useCallback, useEffect, useState} from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import axios from "axios";
const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto; /* Center horizontally */
  padding: 10px;
  border: 1px solid #4F96AD;
  background-color: #8ac3d7;
  border-radius: 10px;
  margin-top: 60px;
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



const AddDevice = () => {

    const [deviceSaveDTO, setDeviceSaveDTO] = useState({
        description: '',
        address: '',
        consumption: '',
        userEmail: '',
    });
    const [description,setDescription] = useState('');
    const [address,setAddress] = useState('');
    const [consumption,setConsumption] = useState(0);
    const [userEmail, setUserEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emails, setEmails] = useState([]);
//const emails = ['user1@example.com', 'user2@example.com', 'user3@example.com'];
    const token= sessionStorage.getItem('token');
    const allRequiredFieldsComplete =
        description.trim() !== '' &&
        address.trim() !== '' &&
        consumption !== 0 &&
        userEmail.trim() !== '' ;

    const getEmails = useCallback(async () => {
        try{
            const responseGet = await axios.get(`http://localhost:8081/personDevice/get`,
                {
                    headers: {
                        Authorization: token,

                    },
                });
            setEmails( responseGet.data.map(item => item.email));

        } catch (error) {
            console.error('Get error:', error);
            alert('An error occurred on getting person details. Please try again later.');
        }
    }, [setEmails, token]);
    useEffect(() => {
        getEmails(); // Call the getEmails function when the component mounts
    }, [getEmails]);
    const handleAddDevice = async(event) => {
        console.log(description,address,consumption,userEmail);
        event.preventDefault();
        if (allRequiredFieldsComplete) {
            try{
                const response = await axios.post('http://localhost:8081/device', {
                    description: description,
                    address: address,
                    consumption: consumption,
                    userEmail: userEmail,
                },{
                        headers: {
                            Authorization: token,

                        },
                    });
                setMessage("Device created!");
            } catch (error) {
                console.error('Get error:', error);
                alert('An error occurred. Please try again later.');
            }

        }

    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setDeviceSaveDTO((prevDeviceSaveDTO) => ({
            ...prevDeviceSaveDTO,
            [name]: value,
        }));

    };



    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //
    //
    //     // If both email and password are valid, you can submit the form or show a success message
    //     setMessage('Form submitted successfully');
    // };
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
                <form>
                    <FormGroup>
                        <Label>Description</Label>
                        <Input
                            type='text'
                            name='description'
                            placeholder='Enter the description of the device'

                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={handleTabKeyPress}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Address</Label>
                        <Input
                            type='text'
                            name='address'
                            placeholder='Enter the address of the device '

                            onChange={(e) => setAddress(e.target.value)}
                            onKeyDown={handleTabKeyPress}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Consumption</Label>
                        <Input
                            type='text'
                            name='consumption'
                            placeholder='Enter the consumption of the device'

                            onChange={(e) => setConsumption(e.target.value)}
                            onKeyDown={handleTabKeyPress}
                        />
                          </FormGroup>
                    <FormGroup>
                        <Label>User Email</Label>
                        <select
                            name='userEmail'

                            onChange={(e) => setUserEmail(e.target.value)}                        >
                            <option value='' disabled>
                                Select an email
                            </option>
                            {emails.map((email, index) => (
                                <option key={index} value={email}>
                                    {email}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <Button type='submit' onClick={handleAddDevice} >Add Device</Button>
                </form>
                {message && <Message>{message}</Message>}
            </FormContainer>
        </>
    );
};

export default AddDevice;
