import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/dashboardstyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // Update the import
import {useNavigation, useRoute} from "@react-navigation/native";
import {Platform, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const API_URL = 'https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec';

const DashboardScreen = () => {
  const route = useRoute();
  const currentRoute = route.name || "UserDashboard"; // Default to "Home" when undefined

  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState(null);  // Add state for username
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);

  /*Add Popup*/
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [siteOptions, setSiteOptions] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  /*Add Popup*/

  /*Edit Popup*/
  const [editSite, setEditSite] = useState(selectedItem?.name || '');
  const [editStartDate, setEditStartDate] = useState(new Date(selectedItem?.startDate || new Date()));
  const [editEndDate, setEditEndDate] = useState(new Date(selectedItem?.endDate || new Date()));
  const [showEditStartPicker, setShowEditStartPicker] = useState(false);
  const [showEditEndPicker, setShowEditEndPicker] = useState(false);
  /*Edit Popup*/

  const updateItem = async () => {
    if (!selectedItem) return;

    const requestData = {
      action: "edit",
      sr: Number(selectedItem.id),
      fromDate: editStartDate.toISOString().split("T")[0],
      toDate: editEndDate.toISOString().split("T")[0],
      site: editSite,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Log updated successfully!");
        setModalVisible(false);
        setData((prevData) =>
          prevData.map((item) => (item.id === selectedItem.id ? { ...item, ...requestData } : item))
        );
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error updating log:", error);
      alert("Failed to update log.");
    }
  };

  const CustomDropdown = ({ options, selectedValue, onSelect }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <View>
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedValue ? selectedValue : "Select Site"}
          </Text>
        </TouchableOpacity>

        <Modal visible={showDropdown} transparent animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setShowDropdown(false)}
          />
          <View style={styles.dropdownContainer1}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(item);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>
    );
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedUsername = await AsyncStorage.getItem('username');

        if (storedEmail) {
          setEmail(storedEmail);
          setUsername(storedUsername || 'Guest'); // Default if username is not found
          await fetchAttendanceLogs(storedEmail);
          await fetchSites();
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
    setLoading(true); // Start loading
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetchLogs', email: userEmail })
      });
      const result = await response.json();
      if (result.status === 'success') {
        const userNameFromResponse = result.logs[0]?.Name;
        if (userNameFromResponse) {
          setUsername(userNameFromResponse);  // Set the username
        }
        // Map the response data to match the format of your state data
        const transformedData = result.logs.map(item => ({
          id: item.logID.toString(), // Convert logID to string
          name: item.site,
          startDate: item.fromDate
          ? new Date(item.fromDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
          : 'Invalid Date',
        endDate: item.toDate
          ? new Date(item.toDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
          : 'Invalid Date',   }));
        setData(transformedData); // Update state with transformed data
      } else {
        console.error('Error fetching logs:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSites = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        API_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getlist" }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setSiteOptions(data.sites.map((s) => s.site)); // Extract site names
      } else {
        console.error("Failed to fetch sites");
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
    setLoading(false);
  };


  const deleteItem = async () => {
    if (!selectedItem) return;
    const requestData = {
      action: "delete",
      sr: Number(selectedItem.id), // Send the item's ID to be deleted
    };

    try {
      const response = await fetch(
          API_URL,
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
  }, [data]); // This will run every time `data` changes


  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const addNewItem = async () => {
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
      const response = await fetch(API_URL, {
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
        onPress={() => {
          setIsAddModalVisible(true);
        }}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>



      <View style={styles.tableContainer}>

        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Site</Text>
          <Text style={styles.headerCell}>Start Date</Text>
          <Text style={styles.headerCell}>End Date</Text>
        </View>

        {loading ? (
  <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
) : (

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.tableRow} onPress={() => openModal(item)}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.startDate}</Text>
              <Text style={styles.cell}>{item.endDate}</Text>
            </TouchableOpacity>
          )}
        />
        )}
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
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            {selectedItem && (
              <>
                <Text style={styles.modalTitle}>Edit Log Entry</Text>
                {/* Site Dropdown */}
                <CustomDropdown
                  options={siteOptions}
                  selectedValue={newSite}
                  onSelect={setNewSite}
                />
                {showPicker && (
                  <Picker
                    selectedValue={editSite}
                    onValueChange={(itemValue) => {
                      setEditSite(itemValue);
                      setShowPicker(false);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Site" value=""/>
                    {siteOptions.map((site, index) => (
                      <Picker.Item key={index} label={site} value={site}/>
                    ))}
                  </Picker>
                )}

                {/* Start Date Picker */}
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowEditStartPicker(true)}>
                  <Text style={styles.dateText}>Start Date: {editStartDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showEditStartPicker && (
                  <DateTimePicker
                    value={editStartDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEditStartPicker(false);
                      if (selectedDate) setEditStartDate(selectedDate);
                    }}
                  />
                )}

                {/* End Date Picker */}
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowEditEndPicker(true)}>
                  <Text style={styles.dateText}>End Date: {editEndDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showEditEndPicker && (
                  <DateTimePicker
                    value={editEndDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEditEndPicker(false);
                      if (selectedDate) setEditEndDate(selectedDate);
                    }}
                  />
                )}

                {/* Buttons */}
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity onPress={updateItem}>
                    <Text style={[styles.button, styles.updateButton]}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteItem}>
                    <Text style={[styles.button, styles.deleteButton]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Data Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Entry</Text>

            {/* Site Dropdown */}
            <CustomDropdown
              options={siteOptions}
              selectedValue={newSite}
              onSelect={setNewSite}
            />

            {showPicker && (
              <View style={styles.pickerContainer}>
                {loading ? (
                  <ActivityIndicator size="small" color="#0000ff"/>
                ) : (
                  <Picker
                    selectedValue={newSite}
                    onValueChange={(itemValue) => {
                      setNewSite(itemValue);
                      setShowPicker(false);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Site" value=""/>
                    {siteOptions.map((site, index) => (
                      <Picker.Item key={index} label={site} value={site}/>
                    ))}
                  </Picker>
                )}
              </View>
            )}

            {/* Start Date Picker */}
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateText}>Start Date: {startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Text>
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
              <Text style={styles.dateText}>End Date: {endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</Text>
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

      <SafeAreaView style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => navigation.replace("UserDashboard")}
          style={[styles.bottomBarButton, currentRoute === "UserDashboard" && styles.activeButton]}
        >
          <Text style={currentRoute === "UserDashboard" ? styles.activeText : styles.inactiveText}>Personal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace("AdminDashboard")}
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
          onPress={() => navigation.replace("ProfilePage")}
          style={[styles.bottomBarButton, currentRoute === "ProfilePage" && styles.activeButton]}
        >
          <Text style={currentRoute === "ProfilePage" ? styles.activeText : styles.inactiveText}>Profile</Text>
        </TouchableOpacity>

      </SafeAreaView>
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
