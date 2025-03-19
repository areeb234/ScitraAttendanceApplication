import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const OTPVerificationScreen = ({route, navigation}) => {
  const {email, username} = route.params; // Receive username
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'verifyOTP',
            email: email,
            otp: otp,
          }),
        },
      );

      const data = await response.json(); // Parse the response as JSON

      if (data.status === 'success') {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('userEmail', email); // 🔹 Store email as well
        navigation.navigate('UserDashboard', {username});

      } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View>
      <Text>Enter OTP:</Text>
      <TextInput value={otp} onChangeText={setOtp} keyboardType="numeric" />
      <Button title="Verify OTP" onPress={handleVerifyOTP} />
    </View>
  );
};

export default OTPVerificationScreen;
