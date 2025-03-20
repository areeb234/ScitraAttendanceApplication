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
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('');
  /*Add Popup*/
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const siteOptions = ["Site A", "Site B", "Site C", "Site D"];
  const [showPicker, setShowPicker] = useState(false);

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

  const deleteItem = async () => {
    if (!selectedItem) return;
    console.log(selectedItem.id)
    const requestData = {
      action: "delete",
      sr: Number(selectedItem.id), // Send the item's ID to be deleted
    };

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        alert("Log deleted successfully!");
        setModalVisible(false);
        setData((prevData) => prevData.filter((item) => item.id !== selectedItem.id)); // Remove from state
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting log:", error);
      alert("Failed to delete log.");
    }
  };

  useEffect(() => {
    console.log('Updated Data:', data);  // Log data whenever it changes
  }, [data]); // This will run every time `data` changes


  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const addNewItem = async () => {
    console.log("add called")
    if (!username.trim() || !email.trim() || !newSite || !startDate || !endDate) {
      alert("Please fill all fields.");
      return;
    }

    const requestData = {
      action: "addLog",
      user: username,
      email: email,
      fromDate: startDate.toISOString().split("T")[0],
      toDate: endDate.toISOString().split("T")[0],
      site: newSite,
      days: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1,
    };

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Log added successfully!");
        setIsAddModalVisible(false);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error adding log:", error);
      alert("Failed to add log.");
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
              <TouchableOpacity onPress={deleteItem}>
                <Text style={[styles.closeButton, styles.deleteButton]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeButton, styles.closeButtonRight]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Data Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Entry</Text>

            {/* Site Dropdown */}
            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => setShowPicker(!showPicker)}
            >
              <Text style={styles.dropdownText}>
                {newSite ? newSite : "Select Site"}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newSite}
                  onValueChange={(itemValue) => {
                    setNewSite(itemValue);
                    setShowPicker(false);
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Site" value="" />
                  {siteOptions.map((site, index) => (
                    <Picker.Item key={index} label={site} value={site} />
                  ))}
                </Picker>
              </View>
            )}

            {/* Start Date Picker */}
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateText}>Start Date: {startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) setStartDate(selectedDate);
                }}
              />
            )}

            {/* End Date Picker */}
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
              <Text style={styles.dateText}>End Date: {endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) setEndDate(selectedDate);
                }}
              />
            )}

            {/* Buttons */}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Text style={[styles.closeButton, styles.closeButtonLeft]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addNewItem}>
                <Text style={[styles.closeButton, styles.addButton]}>Add</Text>
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
