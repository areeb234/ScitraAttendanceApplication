import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';

const OTPScreen = ({route, navigation}) => {
  const [otp, setOtp] = useState('');
  const {email} = route.params;

  const verifyOtp = async () => {
    if (otp) {
      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycby1YPhTL5W2oGxaiajszcbRdlksbyQXrjqYK605PffOTgzbQawNO1asB4vohKT1AbbQ_A/exec',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({action: 'verify-otp', email, otp}),
          },
        );

        if (response.ok) {
          Alert.alert('OTP Verified', 'You have successfully logged in!');
          navigation.navigate('Dashboard', {email});
        } else {
          Alert.alert('Invalid OTP', 'Please enter the correct OTP.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to verify OTP');
      }
    } else {
      Alert.alert('Invalid OTP', 'Please enter the OTP sent to your email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        autoCapitalize="none"
      />
      <Button title="Verify OTP" onPress={verifyOtp} />
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
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default OTPScreen;
