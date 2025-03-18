<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
=======
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
>>>>>>> 12488fdc48dd4bbf588c2cac1fc7167c952c8961
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/dashboardstyles';

const DashboardScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([
    { id: '1', name: 'MEPP',  startDate: '2025-03-18', endDate: '2025-04-18' },
    { id: '2', name: 'Egypt',  startDate: '2025-02-10', endDate: '2025-03-10' },
  ]);

<<<<<<< HEAD

  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('');
=======
  const data = [
    {id: '1', name: 'Item 1', status: 'Active'},
    {id: '2', name: 'Item 2', status: 'Inactive'},
    {id: '3', name: 'Item 3', status: 'Pending'},
  ];
>>>>>>> 12488fdc48dd4bbf588c2cac1fc7167c952c8961

  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };
    getEmail();
  }, []);

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

  if (!email) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {email}</Text>
      </View>

      {/* Plus Button to Open Add Data Modal */}
      <TouchableOpacity
        style={styles.plusButton}
<<<<<<< HEAD
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
=======
        onPress={() => setModalVisible(true)}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.status}</Text>
          </View>
        )}
      />
>>>>>>> 12488fdc48dd4bbf588c2cac1fc7167c952c8961

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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tableRow} onPress={() => openModal(item)}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.startDate || 'N/A'}</Text>
              <Text style={styles.cell}>{item.endDate || 'N/A'}</Text>
            </TouchableOpacity>
          )}
        />
      </View>



      {/* Modal for Viewing Item Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <Text style={styles.modalText}>Site: {selectedItem.name}</Text>
                <Text style={styles.modalText}>Start Date: {selectedItem.startDate}</Text>
                <Text style={styles.modalText}>End Date: {selectedItem.endDate}</Text>
              </>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Delete</Text>
            </TouchableOpacity>
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
            <TouchableOpacity onPress={addNewItem}>
              <Text style={styles.addButton}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

<<<<<<< HEAD
=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row', // This will arrange items horizontally
    justifyContent: 'space-between', // Distributes space between the items
    alignItems: 'center', // Vertically centers the items
    padding: 15,
    marginBottom: 20, // Make it relative so we can position the button
    borderWidth: 1, // Add border on all sides
    borderColor: 'black', // Set the border color
    borderRadius: 5, // Optional: rounded corners
  },
  welcomeText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  plusButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff5733',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
  },
  cell: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    color: '#007bff',
    fontSize: 16,
  },
});

>>>>>>> 12488fdc48dd4bbf588c2cac1fc7167c952c8961
export default DashboardScreen;
