import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/dashboardstyles';

const DashboardScreen = () => {
  const [email, setEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState(null);  // Add state for username
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([
  ]);


  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedUsername = await AsyncStorage.getItem('username');

        if (storedEmail) {
          setEmail(storedEmail);
          setUsername(storedUsername || 'Guest'); // Default if username is not found
          fetchAttendanceLogs(storedEmail);
        } else {
          console.warn('No email found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    getUserData();
  }, []);

  const fetchAttendanceLogs = async (userEmail) => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetchLogs', email: userEmail })
      });
      const result = await response.json();
      console.log(result)
      if (result.status === 'success') {
        const userNameFromResponse = result.logs[0]?.Name;
        if (userNameFromResponse) {
          setUsername(userNameFromResponse);  // Set the username
        }
        // Map the response data to match the format of your state data
        const transformedData = result.logs.map(item => ({
          id: item.logID.toString(), // Convert logID to string
          name: item.site,
          startDate: item.fromDate ? new Date(item.fromDate).toLocaleDateString() : 'Invalid Date', // Check if fromDate exists and format correctly
          endDate: item.toDate ? new Date(item.toDate).toLocaleDateString() : 'Invalid Date' // Check if toDate exists and format correctly
        }));
        setData(transformedData); // Update state with transformed data
      } else {
        console.error('Error fetching logs:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    console.log('Updated Data:', data);  // Log data whenever it changes
  }, [data]); // This will run every time `data` changes


  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const addNewItem = () => {
    if (newName.trim() && newStatus.trim()) {
      setData([...data, { id: Date.now().toString(), name: newName, status: newStatus }]);
      setNewName('');
      setNewStatus('');
      setIsAddModalVisible(false);
    }
  };

  if (!username) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome,{username}</Text>
      </View>

      {/* Plus Button to Open Add Data Modal */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.plusText}>+</Text>

      </TouchableOpacity>
      <TouchableOpacity onPress={clearAsyncStorage}>
        <Text>Clear AsyncStorage</Text>
      </TouchableOpacity>

      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Site</Text>
          <Text style={styles.headerCell}>Start Date</Text>
          <Text style={styles.headerCell}>End Date</Text>
        </View>

        {/* Table Data */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tableRow} onPress={() => openModal(item)}>
              <Text style={styles.cell}>{item.name}</Text> {/* Updated to item.name */}
              <Text style={styles.cell}>{item.startDate}</Text> {/* Updated to item.startDate */}
              <Text style={styles.cell}>{item.endDate}</Text> {/* Updated to item.endDate */}
            </TouchableOpacity>
          )}
        />

      </View>



      {/* Modal for Viewing Item Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <Text style={styles.modalText}>Site: {selectedItem.name}</Text>
                <Text style={styles.modalText}>Start Date: {selectedItem.startDate}</Text>
                <Text style={styles.modalText}>End Date: {selectedItem.endDate}</Text>
              </>
            )}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeButton, styles.deleteButton]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeButton, styles.closeButtonRight]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Modal for Adding New Data */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Add New Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Status"
              value={newStatus}
              onChangeText={setNewStatus}
            />

            {/* Button Row */}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={addNewItem}>
                <Text style={[styles.modalButton, styles.addButton]}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Text style={[styles.modalButton, styles.closeButtonRight]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
};


const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared!');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};
export default DashboardScreen;
