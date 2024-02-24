import React, {useCallback, useEffect, useState} from 'react';
import NavigationBar from "../../navigation-bar";
import DeviceComponent from "../../device/deviceComponent";
import {css} from "@emotion/react";
import {withRouter} from "react-router-dom";
import axios from "axios";
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import EnergyConsumption from "./energy";
import ChatFull from "../../person/chatFull";
import ChatList from "../../person/components/ChatList";

function Client({history}) {

    const deviceListStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    };
    const containerStyle = {
        backgroundColor: '#d0e7ef',
        height: '100vh', // 100% of the viewport height
        width: '100%',
        overflowY: 'scroll',
           };
    const customScrollbarStyles = `
        ::-webkit-scrollbar {
            width: 0;
        }
    `;


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


        if (sessionStorage.getItem('role')!=='CLIENT') {
            history.push('/login');

        }

    }, [history]);
   const token=sessionStorage.getItem('token');
   const email=sessionStorage.getItem('email');
    const [devices, setDevices] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [notification, setNotification] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const email = sessionStorage.getItem('email');

        // Check user authentication and role here...
        // ...

        // Initialize WebSocket connection
        const socket = new SockJS('http://localhost:8082/ws');
        const stompClient = StompJs.over(socket);
        setStompClient(stompClient);

        stompClient.connect({}, (frame) => {
            const email = sessionStorage.getItem('email');
            const userSpecificDestination = `/topic/${email}/user/notification`;

            stompClient.subscribe(userSpecificDestination, (message) => {
                setNotification(message.body);
                setAlertVisible(true);

                // Automatically close the alert after 1 second
                setTimeout(() => {
                    setAlertVisible(false);
                    setNotification(null);
                }, 3000);

            });
        });

        return () => {
            // Disconnect Stomp client when the component unmounts
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);
    const getDevices = useCallback(async () => {
        try{
            const responseGet = await axios.get(`http://localhost:8081/device/${email}`,
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
    }, [setDevices, token]);
    useEffect(() => {
        getDevices(); // Call the getEmails function when the component mounts
    }, [getDevices]);

    const [filteredDevices, setFilteredDevices] = useState(devices);

    useEffect(() => {
        // Filter devices based on the search query whenever it changes
        const filtered = devices.filter((device) =>
            device.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDevices(filtered);
    }, [searchQuery, devices]);

    const handleSearchInputChange = (query) => {
        setSearchQuery(query);
    };

   /* const handleClickOnAlbum = (deviceId) => {
        alert(`Clicked on Device with ID: ${deviceId}`);
        // You can perform other actions here, e.g., show details or navigate to the album page.
    };*/
    const [windowDimensions, setWindowDimensions] = useState({
        height: window.innerHeight,

        width: window.innerWidth,
    });

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                height: window.innerHeight,

                width: window.innerWidth,
            });
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const [selectedDevice, setSelectedDevice] = useState(null); // Track the selected device
    const [showEnergyConsumption, setShowEnergyConsumption] = useState(false); // Track visibility of EnergyConsumption
    const [isChatFullOpen, setIsChatFullOpen] = useState(false);
    // ... (Other existing code)

    const handleDeviceClick = (deviceId) => {
        console.log("am intrat ", deviceId);
        setSelectedDevice(deviceId); // Set the selected device ID when a device is clicked
        setShowEnergyConsumption(!showEnergyConsumption); // Show EnergyConsumption when a device is clicked
    };

    const handleChatFullToggle = () => {
        setIsChatFullOpen(prevState => !prevState);
    };
    return (
        <div style = {containerStyle}>
            <style>{customScrollbarStyles}</style>
            {/* Include the NavigationBar component here */}
            <NavigationBar setSearchQuery={handleSearchInputChange} isAdmin={false} handleChatFullToggle={handleChatFullToggle}/>

            {!isChatFullOpen && <div style={deviceListStyle}>
                {filteredDevices.map((device) => (
                    <DeviceComponent
                        key={device.id}
                        deviceId={device.id}
                        description={device.description}
                        address={device.address}
                        consumption={device.consumption}
                        isClient={true}
                        // imageUrl={device.imageUrl}
                        onClick={() => handleDeviceClick(device.id)}
                    />
                ))}
            </div>}
            {isChatFullOpen && <ChatList />}
            {showEnergyConsumption && selectedDevice && (
                <EnergyConsumption deviceId={selectedDevice} />
            )}
            {alertVisible && notification && (
                <Alert severity="warning" onClose={() => setAlertVisible(false)}  style={{
                    opacity: alertVisible ? '1' : '0',
                    transition: 'opacity 0.5s ease-in-out',
                }}>
                    <AlertTitle>Warning</AlertTitle>
                    {notification}
                </Alert>
            )}

        </div>
    );
}


export default withRouter(Client);
