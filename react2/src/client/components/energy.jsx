import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/system';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function EnergyConsumption({ deviceId }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [energyData, setEnergyData] = useState([]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8082/sensor/${deviceId.toString()}`);
            const sensorData = response.data;

            // Filter sensor data based on the selected date
            const filteredData = sensorData.filter((sensor) => {
                const sensorDate = new Date(Number(sensor.timestamp) * 1000); // Convert timestamp to milliseconds
                return sensorDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
            });

            // Calculate hourly consumption based on every first and sixth elements
            const hourlyConsumption = [];
            for (let i = 0; i < filteredData.length; i += 6) {
                if (i + 6 < filteredData.length) {
                    const consumption = filteredData[i + 6].value - filteredData[i].value;
                    hourlyConsumption.push({
                        hour: new Date(Number(filteredData[i].timestamp) * 1000).getHours(),
                        energyValue: consumption,
                    });
                }
            }

            setEnergyData(hourlyConsumption);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            alert('An error occurred while fetching sensor details. Please try again later.');
        }
    }, [deviceId, selectedDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                style={{ marginBottom: '20px', padding: '5px' }}
            />
            <div style={{ width: '90%', height: '400px', border: '1px solid #ccc' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="energyValue" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Box>
    );
}

export default EnergyConsumption;
