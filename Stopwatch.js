import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        // Update the current date and time every second
        const dateTimeInterval = setInterval(() => {
            const now = new Date();
            setCurrentDateTime(now.toLocaleString());
        }, 1000);

        return () => clearInterval(dateTimeInterval);
    }, []);

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ((ms % 1000) / 10).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds.padStart(2, '0')}`;
    };

    const toggleLED = async () => {
        try {
            const response = await fetch('http://192.168.57.30/toggleLED');
            const text = await response.text();
            console.log('LED Response:', text); // Log response from NodeMCU
        } catch (error) {
            console.error('Error toggling LED:', error);
        }
    };

    const sendCharacter = async (char) => {
        try {
            const response = await fetch(`http://192.168.57.30/send?data=${char}`);
            const text = await response.text();
            console.log(`Response for ${char}:`, text); // Log response from NodeMCU
        } catch (error) {
            console.error(`Error sending character ${char}:`, error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.dateTime}>{currentDateTime}</Text>
            <Text style={styles.time}>{formatTime(time)}</Text>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={() => setRunning(!running)} style={styles.button}>
                    <Text style={styles.buttonText}>{running ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setRunning(false); setTime(0); }} style={styles.button}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
            {/* Ensure the LED button is visible */}
            <TouchableOpacity onPress={toggleLED} style={styles.ledButton}>
                <Text style={styles.buttonText}>Toggle LED</Text>
            </TouchableOpacity>
            <View style={styles.characterButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((char) => (
                    <TouchableOpacity
                        key={char}
                        onPress={() => sendCharacter(char)}
                        style={styles.charButton}
                    >
                        <Text style={styles.buttonText}>{char}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#f5f5f5', paddingTop: 80 },
    time: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
    dateTime: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    buttons: { flexDirection: 'row', marginBottom: 20 }, // Adjusted spacing
    button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginHorizontal: 10 },
    buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    ledButton: { backgroundColor: '#FF9500', padding: 15, borderRadius: 10, marginTop: 20, width: '80%', alignItems: 'center' }, // Adjusted width and alignment
    characterButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 },
    charButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 10, margin: 10, width: 160, height: 60, alignItems: 'center' }
});

export default Stopwatch;
