/* eslint-disable react/no-unknown-property */
import { useState } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
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



const EditDevice = ({id, description, address, consumption,onUpdateDevice}) => {

    console.log("description" + description);
    const [deviceSaveDTO, setDeviceSaveDTO] = useState({
        description: description,
        address: address,
        consumption: consumption,

    });
    const [descriptionForm, setDescriptionForm] = useState(description);
    const [addressForm, setAddressForm] = useState(address);
    const [consumptionForm, setConsumptionForm] = useState(consumption);
    const [message, setMessage] = useState('');
    const token = sessionStorage.getItem('token');

    const handleEditDevice = async(event) => {
        event.preventDefault();


        try{
            const response = await axios.put('http://localhost:8081/device', {
                id: id,
                description: descriptionForm,
                address: addressForm,
                consumption: consumptionForm,
            },{
                headers: {
                    Authorization: token,

                },
            });
            onUpdateDevice(id,descriptionForm,addressForm,consumptionForm);
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
                        <Label>Description</Label>
                        <Input
                            type='text'
                            name='description'
                            placeholder='Enter the description of the device'
                            value={descriptionForm}
                            onChange={(e) => setDescriptionForm(e.target.value)}
                            onKeyDown={handleTabKeyPress}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Address</Label>
                        <Input
                            type='text'
                            name='address'
                            placeholder='Enter the address of the device '
                            value={addressForm}
                            onChange={(e) => setAddressForm(e.target.value)}
                            onKeyDown={handleTabKeyPress}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Consumption</Label>
                        <Input
                            type='text'
                            name='consumption'
                            placeholder='Enter the consumption of the device'
                            value={consumptionForm}
                            onChange={(e) => setConsumptionForm(e.target.value)}
                            onKeyDown={handleTabKeyPress}
                        />
                    </FormGroup>


                    <Button type='submit' onClick={handleEditDevice}>Edit Device</Button>
                </form>
                {message && <Message>{message}</Message>}

        </>
    );
};

export default EditDevice;
