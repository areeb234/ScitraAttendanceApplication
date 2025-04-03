import React, { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image, TouchableOpacity
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Email cannot be empty.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid company email address.');
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 Sending login request to API...');

      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'login',
            email: email,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ API Response:', responseData);

      if (responseData.status === 'success') {
        Alert.alert('Success', 'OTP has been sent to your email.');
        navigation.navigate('OTPVerification', {
          email,
          username: responseData.user,
        });
      } else {
        Alert.alert('Error', responseData.message || 'Login failed.');
        console.error('❌ API Request Failed:', responseData.message);
      }
    } catch (error) {
      console.error('❌ API Request Failed:', error.message);
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./Images/logo.jpeg')} style={styles.logo} />
      <Text style={styles.header}>         Al Batha{"\n"}Business Trip Log</Text>
      <Text style={styles.description}>
        Please enter your company email address to receive a One-Time Password (OTP) for authentication.
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter your company email"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>      )}
    </View>
  );r
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  logo: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  button: {
    borderWidth: 2, // Border thickness
    borderColor: '#007AFF', // Border color (blue)
    borderRadius: 10, // Rounded corners
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    backgroundColor: '#FFFFFF', // White background
    alignItems: 'center', // Center text horizontally
  },
  buttonText: {
    color: '#007AFF', // Blue text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
