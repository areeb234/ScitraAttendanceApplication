import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/profilestyles';
import {useNavigation, useRoute} from "@react-navigation/native";

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const currentRoute = route.name || "ProfilePage"; // Default to "Home" when undefined

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
        const currentRoute = route.name || "ProfilePage"; // Default to "Home" when undefined
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared!');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{username || 'N/A'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email || 'N/A'}</Text>
      </View>
      <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={async () => {
                try {
                await clearAsyncStorage(); // Clear AsyncStorage
                navigation.navigate('Login'); // Navigate to the Login page
                } catch (error) {
                console.error('Error during logout:', error);
                }
            }}
            >
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      <View style={styles.bottomBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate("UserDashboard")}
        style={[styles.bottomBarButton, currentRoute === "UserDashboard" && styles.activeButton]}
      >
        <Text style={currentRoute === "UserDashboard" ? styles.activeText : styles.inactiveText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AdminDashboard")}
        style={[styles.bottomBarButton, currentRoute === "AdminDashboard" && styles.activeButton]}
      >
        <Text style={currentRoute === "AdminDashboard" ? styles.activeText : styles.inactiveText}>Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ProfilePage")}
        style={[styles.bottomBarButton, currentRoute === "ProfilePage" && styles.activeButton]}
      >
        <Text style={currentRoute === "ProfilePage" ? styles.activeText : styles.inactiveText}>Profile</Text>
      </TouchableOpacity>
    </View>
    </View>
    
  );
};



export default ProfilePage;
