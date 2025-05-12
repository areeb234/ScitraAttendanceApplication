import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/profilestyles';
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';


const API_URL = 'https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const currentRoute = route.name || "ProfilePage";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
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

  const handleDeleteAccount = async () => {
    console.log(email)
    try {
      setIsDeleting(true);
  
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteUser',
          email: email,
        }),
      });
  
     

      const result = await response.json();

      if (result.status === "success") {
        await clearAsyncStorage();
        setIsDeleting(false);
        setModalVisible(false);
        navigation.replace('Login');
      } else {
        throw new Error(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setIsDeleting(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{username || 'N/A'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email || 'N/A'}</Text>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={async () => {
          try {
            await clearAsyncStorage();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
            } catch (error) {
            console.error('Error during logout:', error);
          }
        }}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Delete Account Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Modal for Delete Confirmation */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {isDeleting ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <Text style={styles.modalTitle}>Confirm Delete</Text>
                <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
                <Text style={[styles.modalText, { color: 'red', marginTop: 10 }]}>
            This action is irreversible. All your data, including attendance logs, will be permanently deleted.
          </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleDeleteAccount}
                  >
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserDashboard")}
          style={[styles.bottomBarButton, currentRoute === "UserDashboard" && styles.activeButton]}
        >
          <Text style={currentRoute === "UserDashboard" ? styles.activeText : styles.inactiveText}>Personal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("AdminDashboard")}
          style={[styles.bottomBarButton, currentRoute === "AdminDashboard" && styles.activeButton]}
        >
          <Text style={currentRoute === "AdminDashboard" ? styles.activeText : styles.inactiveText}>YTD Log</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => navigation.replace("Travel Status")}
            style={[styles.bottomBarButton, currentRoute === "Travel Status" && styles.activeButton]}>
            <Text style={currentRoute === "Travel Status" ? styles.activeText : styles.inactiveText}>Current</Text>
          </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ProfilePage")}
          style={[styles.bottomBarButton, currentRoute === "ProfilePage" && styles.activeButton]}
        >
          <Text style={currentRoute === "ProfilePage" ? styles.activeText : styles.inactiveText}>Profile</Text>
        </TouchableOpacity>
       
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;
