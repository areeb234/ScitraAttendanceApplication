import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/dashboardstyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // Update the import


const DashboardScreen = () => {
  const [email, setEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState(null);  // Add state for username
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('');


  /*Add Popup*/
  const [selectedSite, setSelectedSite] = useState(''); // Initialize selectedSite with an empty string or a default value
  const [dateFrom, setDateFrom] = useState(new Date()); // Initialize with current date
  const [dateTo, setDateTo] = useState(new Date()); // Initialize with current date
  const [showDateFrom, setShowDateFrom] = useState(false);
  const [showDateTo, setShowDateTo] = useState(false);
  const onChangeDateFrom = (event, selectedDate) => {
    setShowDateFrom(false);
    setDateFrom(selectedDate || dateFrom);
  };
  const onChangeDateTo = (event, selectedDate) => {
    setShowDateTo(false);
    setDateTo(selectedDate || dateTo);
  };
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Track Picker visibility
  const handlePickerClick = () => {
    setIsPickerVisible(true); // Toggle the picker visibility when the field is clicked
  };
  const handlePickerValueChange = (value) => {
    setSelectedSite(value);
    setIsPickerVisible(false); // Hide the picker once a value is selected
  };
  /*Add Popup*/



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
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
      </View>

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

            {/* Dropdown for Sites */}
            <TouchableOpacity onPress={handlePickerClick}>
              <TextInput
                style={styles.input}
                placeholder="Select Site"
                value={selectedSite}
                editable={false}
              />
            </TouchableOpacity>
            {isPickerVisible && (
              <Picker
                selectedValue={selectedSite}
                style={styles.picker}
                onValueChange={handlePickerValueChange}
              >
                <Picker.Item label="Select Site" value="" />
                <Picker.Item label="Site 1" value="site1" />
                <Picker.Item label="Site 2" value="site2" />
                <Picker.Item label="Site 3" value="site3" />
                {/* Add more sites as needed */}
              </Picker>
            )}

            {/* Date From */}
            <TouchableOpacity onPress={() => setShowDateFrom(true)}>
              <TextInput
                style={styles.input}
                placeholder="Select Date From"
                value={dateFrom ? dateFrom.toLocaleDateString() : ''}
                editable={false}
              />
            </TouchableOpacity>
            {showDateFrom && (
              <DateTimePicker
                value={dateFrom}
                mode="date"
                display="default"
                onChange={onChangeDateFrom}
              />
            )}

            {/* Date To */}
            <TouchableOpacity onPress={() => setShowDateTo(true)}>
              <TextInput
                style={styles.input}
                placeholder="Select Date To"
                value={dateTo ? dateTo.toLocaleDateString() : ''}
                editable={false}
              />
            </TouchableOpacity>
            {showDateTo && (
              <DateTimePicker
                value={dateTo}
                mode="date"
                display="default"
                onChange={onChangeDateTo}
              />
            )}

            {/* Button Row */}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={addNewItem} style={[styles.modalButton, styles.addButton]}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)} style={[styles.modalButton, styles.closeButton]}>
                <Text style={styles.buttonText}>Close</Text>
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
