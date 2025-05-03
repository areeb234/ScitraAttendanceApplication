import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image, TouchableOpacity
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

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
      Alert.alert('Validation Error', 'Please enter a valid email address.');
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

  const handleSignup = async () => {
    if (!signupName.trim() || !signupEmail.trim()) {
      Alert.alert('Validation Error', 'Name and Email cannot be empty.');
      return;
    }

    if (!validateEmail(signupEmail)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'signup',
            name: signupName,
            email: signupEmail,
          }),
        },
      );

      const responseData = await response.json();

      if (responseData.status === 'success') {
        Alert.alert('Signup Successful', responseData.message || 'Signup completed successfully.');
        setModalVisible(false);
        setSignupName('');
        setSignupEmail('');
      } else {
        Alert.alert('Error', responseData.message || 'Signup failed.');
      }
    } catch (error) {
      Alert.alert('Error', `Something went wrong: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{"\n"}Business Trip Log</Text>
      <Text style={styles.description}>
        Please enter your registered email address to receive a One-Time Password (OTP) for authentication.
      </Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter your registered email"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>   
      )}
      <TouchableOpacity style={styles.signupButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.signupText}>Signup</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Signup</Text>
          
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={signupName}
              onChangeText={setSignupName}
            />
  <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleSignup}>
              <Text style={styles.modalButtonText}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  signupButton: {
    marginTop: 15,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  
  signupText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: 'red',
  },
});

export default LoginScreen;
