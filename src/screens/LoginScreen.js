import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const sendCode = async () => {
    if (email) {
      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbw1GzlR2B3RO-dLrgJGjwVYU8FdBdqMKfsXo0_rHLG8PrhEqV6nB9F3OJFVIeberi7Rqw/exec',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({action: 'send-otp', email}),
          },
        );

        const text = await response.text();
        if (response.ok && text === 'OTP sent') {
          Alert.alert('Code Sent', `A code has been sent to ${email}`);
          navigation.navigate('OTPScreen', {email});
        } else if (text === 'Unauthorized') {
          Alert.alert('Error', 'Email not found in the system');
        } else {
          Alert.alert('Error', 'Failed to send OTP');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to send OTP');
      }
    } else {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Al-Batha Business Trip Attendance System</Text>
      <Image source={require('./Images/download.jpg')} style={styles.image} />
      <Text style={styles.title}>Please Enter Your Email!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Send Code" onPress={sendCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default LoginScreen;
