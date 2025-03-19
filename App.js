import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import OTPVerificationScreen from './src/screens/OTPScreen';
import UserDashboard from './src/screens/Dashboard';
import AdminDashboard from './src/screens/AdminDashboard';
import { View, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null); // Default null to avoid premature render

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        console.log("Saved Email:", savedEmail); // Debugging log
        setInitialRoute(savedEmail ? 'UserDashboard' : 'Login');
      } catch (error) {
        console.error('Error checking login status:', error);
        setInitialRoute('Login'); // Fallback
      }
    };
    checkLoginStatus();
  }, []);

  // 🔹 Wait until `initialRoute` is determined before rendering the navigator
  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
