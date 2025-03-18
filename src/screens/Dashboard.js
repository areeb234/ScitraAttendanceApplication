import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/dashboardstyles';

const DashboardScreen = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([
    { id: '1', name: 'MEPP',  startDate: '2025-03-18', endDate: '2025-04-18' },
    { id: '2', name: 'Egypt',  startDate: '2025-02-10', endDate: '2025-03-10' },
  ]);


  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('');

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
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.plusText}>+</Text>
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

export default DashboardScreen;
