import React, {useCallback, useEffect, useState} from 'react';
import NavigationBar from "../navigation-bar";
import AddPerson from "../person/components/addPerson";
import EditPerson from "../person/components/editPerson";
import AddDevice from "../device/addDevice";
import DeviceComponent from "../device/deviceComponent";
import EditDevice from "../device/editDevice";
import PersonComponent from "../person/components/personComponent";
import {withRouter} from "react-router-dom";
import axios from "axios";
import styled from '@emotion/styled';
import ChatFull from "../person/chatFull";
import ChatList from "../person/components/ChatList";


function Admin({history}) {
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const [isAddPersonFormOpen, setIsAddPersonFormOpen] = useState(false);
    const [isEditPersonFormOpen, setIsEditPersonFormOpen] = useState(false);
    const [isAddDeviceFormOpen, setIsAddDeviceFormOpen] = useState(false);
    const [isEditDeviceFormOpen, setIsEditDeviceFormOpen] = useState(false);
    const [isViewDevicesOpen, setIsViewDevicesOpen] = useState(false);
    const [isViewPersonsOpen, setIsViewPersonsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {

        const hasAccessedBefore =
        sessionStorage.getItem('accessedBefore') === 'true';

    if (!hasAccessedBefore) {
        history.push('/login');
        sessionStorage.setItem('accessedBefore', 'true');
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
        history.push('/login');
    }
}, [history]);
    useEffect(() => {


        if (sessionStorage.getItem('role')!=='ADMIN') {
            history.push('/login');

        }

    }, [history]);
const token = sessionStorage.getItem('token');
    const deviceListStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: isEditDeviceFormOpen ? '80%' : '100%',

    };
    const FormContainer = styled.div`
      max-width: 400px;
      padding: 10px;
      border: 1px solid #4F96AD;
      background-color: #8ac3d7;
      border-radius: 10px;
      position: fixed;
      top: 125px;
      right: 20px;
      //margin: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
     // z-index: 9999; /* Ensure it's on top of other elements */
    `;


    const personListStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: isEditPersonFormOpen ? '80%' : '100%',

    };
    const containerStyle = {
        backgroundColor: '#d0e7ef',
        height: '100vh', // 100% of the viewport height
        width:'100%',
        overflowY: 'scroll',
    };
    const customScrollbarStyles = `
        ::-webkit-scrollbar {
            width: 0;
        }
    `;
    const [devices, setDevices] = useState([]);
    const getDevices =async () => {
        try{
            const responseGet = await axios.get(`http://localhost:8081/device`,
                {
                    headers: {
                        Authorization: token,

                    },
                });
            setDevices( responseGet.data);
            console.log(responseGet.data);

        } catch (error) {
            console.error('Get error:', error);
            alert('An error occurred on getting person details. Please try again later.');
        }
    };
  /*  useEffect(() => {
        getDevices(); // Call the getEmails function when the component mounts
    }, [getDevices]);
*/

    const [persons, setPersons] = useState([]);
    const getPersons = async () => {
        try{
            const responseGet = await axios.get(`http://localhost:8080/person`,
                {
                    headers: {
                        Authorization: token,

                    },
                });
            setPersons( responseGet.data);
            console.log(responseGet.data);
        } catch (error) {
            console.error('Get error:', error);
            alert('An error occurred on getting person details. Please try again later.');
        }
    };
  /*  useEffect(() => {
        getPersons(); // Call the getEmails function when the component mounts
    }, [getPersons]);
*/
    const [selectDeviceData, setSelectDevicedata] = useState( {
        id: 0,
        description: '',
        address: '',
        consumption: 0,
        // imageUrl: 'device1.jpg',
    });
    const [selectPersonData, setSelectPersondata] = useState( {
        email: '',
        name: '',
        role:'',

    });
    const getSelectedDeviceData = () => {
        if (selectedDevice === null) {
            return null;
        }
         setSelectDevicedata(devices.find(device => device.id === selectedDevice));
    };
    const [filteredDevices, setFilteredDevices] = useState(devices);
    const [filteredPersons, setFilteredPersons] = useState(persons);
    const handleDeviceClick = (deviceId) => {
        if(!isEditDeviceFormOpen) {
            setSelectedDevice(deviceId);
            setSelectDevicedata(devices.find(device => device.id === deviceId));

            setIsEditDeviceFormOpen(true);
        }
        else{
            setIsEditDeviceFormOpen(false);
        }
    };
    const handlePersonClick = (email) => {
        if(!isEditPersonFormOpen) {

            setSelectedPerson(email);
            setSelectPersondata(persons.find(person => person.email === email));

            setIsEditPersonFormOpen(true);
        }
        else{
            setIsEditPersonFormOpen(false);
        }
    };

    useEffect(() => {
        // Filter devices based on the search query whenever it changes
        const filtered = devices.filter((device) =>
            device.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDevices(filtered);
    }, [searchQuery, devices]);

    useEffect(() => {
        // Filter devices based on the search query whenever it changes
        const filteredPersons = persons.filter((person) =>
            person.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPersons(filteredPersons);
    }, [searchQuery,persons]);
    const handleSearchInputChange = (query) => {
        setSearchQuery(query);
    };
    const openAddPersonForm = () => {
        setIsAddPersonFormOpen(true);
        setIsAddDeviceFormOpen(false);
        setIsViewDevicesOpen(false);
        setIsViewPersonsOpen(false);

    };

    const openAddDeviceForm = () => {
        setIsAddDeviceFormOpen(true);
        setIsViewDevicesOpen(false);
        setIsAddPersonFormOpen(false);
        setIsViewPersonsOpen(false);

    };

    const openViewDevices = () => {
        getDevices();
        setIsViewDevicesOpen(true);
        setIsAddDeviceFormOpen(false);
        setIsAddPersonFormOpen(false);
        setIsViewPersonsOpen(false);

    };
    const openViewPersons = () => {
        getPersons();
        setIsViewDevicesOpen(false);
        setIsAddDeviceFormOpen(false);
        setIsAddPersonFormOpen(false);
        setIsViewPersonsOpen(true);

    };
    const updatePersonData = (email, newName) => {
        // Find the person in the state and update their name
        setPersons((prevPersons) => {
            return prevPersons.map((person) =>
                person.email === email ? { ...person, name: newName } : person
            );
        });
    };
    const updateDeviceData = (deviceId, newDescription, newConsumption, newAddress) => {
        // Find the device in the state and update its properties
        setDevices((prevDevices) => {
            return prevDevices.map((device) =>
                device.id === deviceId
                    ? {
                        ...device,
                        description: newDescription,
                        consumption: newConsumption,
                        address: newAddress
                    }
                    : device
            );
        });
    };
    const deleteDeviceById = (deviceId) => {
        // Filter out the device with the specified ID
        setDevices((prevDevices) => prevDevices.filter((device) => device.id !== deviceId));
    };
    const deletePersonById = (personEmail) => {
        // Filter out the device with the specified ID
        setPersons((prevPersons) => prevPersons.filter((person) => person.email !== personEmail));
    };
    console.log(selectedPerson);
    console.log(isEditPersonFormOpen);
    const [isChatFullOpen, setIsChatFullOpen] = useState(false);
    const handleChatFullToggle = () => {
        setIsChatFullOpen(prevState => !prevState);
    };
    return (
        <div style = {containerStyle}>
            <style>{customScrollbarStyles}</style>
            {/* Include the NavigationBar component here */}
            <NavigationBar setSearchQuery={handleSearchInputChange} isAdmin={true} openAddPersonForm={openAddPersonForm}  openAddDeviceForm = {openAddDeviceForm} openViewDevices={openViewDevices} openViewPersons={openViewPersons}  handleChatFullToggle={handleChatFullToggle}/>
            {!isChatFullOpen && !isViewDevicesOpen && !isAddDeviceFormOpen && !isViewPersonsOpen && isAddPersonFormOpen && <AddPerson />}
            {isChatFullOpen && <ChatList />}
            {!isChatFullOpen && !isViewDevicesOpen && isAddDeviceFormOpen && !isViewPersonsOpen&& !isAddPersonFormOpen && <AddDevice />}
            {!isChatFullOpen&& isViewDevicesOpen &&!isViewPersonsOpen&& !isAddDeviceFormOpen && !isAddPersonFormOpen &&(<div style={deviceListStyle}>
                { filteredDevices.map((device) => (
                    <DeviceComponent
                        key={device.id}
                        deviceId={device.id}
                        description={device.description}
                        address={device.address}
                        consumption={device.consumption}
                        userEmail ={device.userEmail}
                        isClient={false}
                        onSelectDevice={handleDeviceClick}
                        onDeleteDevice={deleteDeviceById}
                        // imageUrl={device.imageUrl}
                        // onClickAlbum={handleClickOnAlbum}
                    />
                ))}
            </div>
                )}
            {!isChatFullOpen && !isViewDevicesOpen&&isViewPersonsOpen && !isAddDeviceFormOpen && !isAddPersonFormOpen &&(<div style={personListStyle}>
                    {filteredPersons.map((person,index) => (
                        <PersonComponent
                            key={index}
                            email={person.email}
                            name={person.name}
                            role={person.role}
                            onSelectPerson={handlePersonClick}
                            onDeletePerson={deletePersonById}
                            // imageUrl={device.imageUrl}
                            // onClickAlbum={handleClickOnAlbum}
                        />
                    ))}
                </div>
            )}
            {isEditDeviceFormOpen && selectedDevice !== null && (
                <FormContainer>

                <EditDevice
                    id={selectDeviceData.id}
                    description={selectDeviceData.description}
                    address={selectDeviceData.address}
                    consumption={selectDeviceData.consumption}
                    onUpdateDevice={updateDeviceData}// Pass any other required props here
                />
                </FormContainer>
            )}
            {isEditPersonFormOpen && selectedPerson !== null  && (
                // Render the EditDevice component with selected device data
                <FormContainer>
                <EditPerson
                    email={selectPersonData.email}
                    name={selectPersonData.name}
                    role = {selectPersonData.role}
                    onUpdatePerson={updatePersonData}


                />
                </FormContainer>
            )}
            {/* Rest of your component code */}
        </div>
    );
}


export default withRouter(Admin);
