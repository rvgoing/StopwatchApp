import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { registerRootComponent } from 'expo';  // Import this
import Stopwatch from './Stopwatch';

// function App() {
//     return (
//         <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text style={{ fontSize: 24, marginBottom: 20 }}>Stopwatch App</Text>
//             <Stopwatch />
//         </SafeAreaView>
//     );
// }

export default function App() {
    return <Stopwatch />;
}


registerRootComponent(App);  // Register the root component