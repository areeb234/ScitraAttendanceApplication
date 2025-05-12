import React, { useState, useEffect } from 'react';
import {View, Text,   TextInput,  FlatList, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/dashboardstyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation, useRoute} from "@react-navigation/native";


const API_URL = 'https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name || "AdminDashboard"; // Default to "Home" when undefined
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState(null);  // Add state for username
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);

  /*Add Popup*/
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [siteOptions, setSiteOptions] = useState([]);
  /*Add Popup*/

  
  /*Edit Popup*/
  const [editSite, setEditSite] = useState(selectedItem?.name || '');
  const [editStartDate, setEditStartDate] = useState(new Date(selectedItem?.startDate || new Date()));
  const [editEndDate, setEditEndDate] = useState(new Date(selectedItem?.endDate || new Date()));
  const [showEditStartPicker, setShowEditStartPicker] = useState(false);
  const [showEditEndPicker, setShowEditEndPicker] = useState(false);
  /*Edit Popup*/  

  // filter part
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table
  const [filterModalVisible, setFilterModalVisible] = useState(false); // Toggle filter dropdown
  const [filteredUsernameOptions, setFilteredUsernameOptions] = useState([]);
  const [filteredSiteOptions, setFilteredSiteOptions] = useState([]);
  
  // Filter States
  const [filterUsername, setFilterUsername] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);



  useEffect(() => {
    let updatedUsernameOptions = data;
    let updatedSiteOptions = data;
  
    if (filterSite) {
      updatedUsernameOptions = data.filter(item => item.site === filterSite);
    }
  
    if (filterUsername) {
      updatedSiteOptions = data.filter(item => item.username === filterUsername);
    }
  
    setFilteredUsernameOptions([...new Set(updatedUsernameOptions.map(item => item.username))]);
    setFilteredSiteOptions([...new Set(updatedSiteOptions.map(item => item.site))]);
  }, [filterUsername, filterSite, data]);
  
// Utility function to convert DD/MM/YYYY to YYYY-MM-DD
const convertToISODate = (dateInput) => {
  if (!dateInput) return null;

  if (typeof dateInput === 'string') {
    // Try parsing format: '01 May 2025'
    const match = dateInput.match(/^(\d{2}) (\w{3,}) (\d{4})$/);
    if (match) {
      const [_, day, monthStr, year] = match;

      // Convert month name to month number
      const monthMap = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
      };

      const month = monthMap[monthStr];
      if (month === undefined) {
        console.warn('Unrecognized month:', monthStr);
        return null;
      }

      const parsedDate = new Date(Number(year), month, Number(day));
      return parsedDate.toISOString().split('T')[0];
    }

    // Fallback: Try new Date() directly
    const parsedFallback = new Date(dateInput);
    if (!isNaN(parsedFallback)) {
      return parsedFallback.toISOString().split('T')[0];
    }

    console.warn('Invalid date string format:', dateInput);
    return null;
  }

  if (dateInput instanceof Date) {
    return dateInput.toISOString().split('T')[0];
  }

  console.warn('Unsupported date input:', dateInput);
  return null;
};


const filterData = () => {
  let filtered = data;

  if (filterUsername) {
    filtered = filtered.filter(item =>
      item.username.toLowerCase().includes(filterUsername.toLowerCase())
    );
  }

  if (filterSite) {
    filtered = filtered.filter(item =>
      item.site.toLowerCase().includes(filterSite.toLowerCase())
    );
  }

  // Debugging start date filter with validation
  const parsedStartDate = filterStartDate ? new Date(convertToISODate(filterStartDate)) : null;
  const parsedEndDate = filterEndDate ? new Date(convertToISODate(filterEndDate)) : null;
  
  filtered = filtered.filter(item => {
    const itemStartDate = new Date(convertToISODate(item.startDate));
    const itemEndDate = new Date(convertToISODate(item.endDate));
  
    if (parsedStartDate && !parsedEndDate) {
      return itemStartDate >= parsedStartDate;
    }
  
    if (!parsedStartDate && parsedEndDate) {
      return itemEndDate <= parsedEndDate;
    }
  
    if (parsedStartDate && parsedEndDate) {
      return itemStartDate >= parsedStartDate && itemEndDate <= parsedEndDate;
    }
  
    return true; // No date filters applied
  });
  
  setFilteredData(filtered);
  setFilterModalVisible(false); // Close filter dropdown after applying
  console.log("Filtered data:", filtered);
};

  
  

  // Load data into filteredData initially
  useEffect(() => {
    setFilteredData(data);
  }, [data]);


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
            {selectedValue ? selectedValue : "Select"}
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
        body: JSON.stringify({ action: 'adminDashboard' })
      });
      const result = await response.json();
      if (result.status === 'success') {
        const transformedData = result.logs.map(item => ({
          id: item.logID.toString(),
          username: item.user || 'N/A',
          site: item.site || 'N/A',
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
          : 'Invalid Date',

        }));
        setData(transformedData);
        setSiteOptions([...new Set(transformedData.map(item => item.site))]);
      } else {
        console.error('Error fetching logs:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  // const fetchSites = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       API_URL,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ action: "getlist" }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (data.status === "success") {
  //       setSiteOptions(data.sites.map((s) => s.site)); // Extract site names
  //     } else {
  //       console.error("Failed to fetch sites");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching sites:", error);
  //   }
  //   setLoading(false);
  // };


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
        <Text style={styles.welcomeText}>Welcome Admin</Text>
      </View>
      <TouchableOpacity 
        style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 10 }} 
        onPress={() => setFilterModalVisible(true)}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Filter</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, width: '80%', borderRadius: 10 }}>

            {/* Username Filter */}
            <Text>Filter by Username:</Text>
            <CustomDropdown
              options={filteredUsernameOptions}
              selectedValue={filterUsername}
              onSelect={setFilterUsername}
            />

            {/* Site Filter */}
            <Text>Filter by Site:</Text>
            <CustomDropdown
              options={filteredSiteOptions}
              selectedValue={filterSite}
              onSelect={setFilterSite}
            />

            {/* Start Date Filter */}
            <Text>Filter by Start Date:</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
              <Text>{filterStartDate ? filterStartDate.toDateString() : 'Select Start Date'}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={filterStartDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date) setFilterStartDate(date);
                }}
              />
            )}

            {/* End Date Filter */}
            <Text>Filter by End Date:</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
              <Text>{filterEndDate ? filterEndDate.toDateString() : 'Select End Date'}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={filterEndDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setFilterEndDate(date);
                }}
              />
            )}

            {/* Apply and Close Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={filterData} style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginTop: 10  }}>
                <Text style={{ color: "#000", textAlign: "center"  }}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={{ backgroundColor: '#dc3545', padding: 10, borderRadius: 5, marginTop: 10 }}>
                <Text style={{ color: "#000", textAlign: "center"  }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                      onPress={() => {
                        setFilterUsername(null);
                        setFilterSite(null);
                        setFilterStartDate(null);
                        setFilterEndDate(null);
                        setFilteredData([...data]);
                        setFilterModalVisible(false);
                      }}
                      style={{ backgroundColor: "#ffc107", padding: 10, borderRadius: 5, marginTop: 10 }}
                      >
                      <Text style={{ color: "#000", textAlign: "center" }}>Reset</Text>
                    </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>


      <View style={styles.tableContainer}>

        <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>User</Text>
        <Text style={styles.headerCell}>Site</Text>
          <Text style={styles.headerCell}>Start Date</Text>
          <Text style={styles.headerCell}>End Date</Text>
        </View>

        {loading ? (
  <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.tableRow} onPress={() => openModal(item)}>
              <Text style={styles.cell}>{item.username}</Text>
              <Text style={styles.cell}>{item.site}</Text>
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
                  onSelect={setEditSite}
                />

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
      <View style={styles.bottomBar}>
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
        onPress={() =>navigation.replace("ProfilePage")}
        style={[styles.bottomBarButton, currentRoute === "ProfilePage" && styles.activeButton]}
      >
        <Text style={currentRoute === "ProfilePage" ? styles.activeText : styles.inactiveText}>Profile</Text>
      </TouchableOpacity>
      
    </View>
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
