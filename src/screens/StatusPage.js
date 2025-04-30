import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../../styles/statusstyles'; // Import your base styles

const API_URL = 'https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec';

const StatusPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;

  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj)) return '';
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const fetchStatusData = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetchstatus' }),
      });
  
      const result = await response.json();
      if (result.status === 'success') {
        const formattedData = result.logs.map((item, index) => {
          const sameLocation = item.dlocation === item.clocation;
          return {
            id: index.toString(),
            name: item.user,
            defaultLocation: item.dlocation,
            currentLocation: item.clocation,
            sameLocation: sameLocation,
            date1: item.fromDate && !isNaN(new Date(item.fromDate)) ? formatDate(item.fromDate) : '',
            date2: item.toDate && !isNaN(new Date(item.toDate)) ? formatDate(item.toDate) : '',
          };
        });
  
        // Sort: items with different locations first
        const sortedData = formattedData.sort((a, b) => {
          return a.sameLocation === b.sameLocation ? 0 : a.sameLocation ? 1 : -1;
        });
  
        setStatusData(sortedData);
      } else {
        console.error('Failed to fetch status data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching status data:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchStatusData();
  }, []);

  const renderItem = ({ item }) => {
    const cardStyle = {
      ...styles.card,
      backgroundColor: item.sameLocation ? '#e2f5e2' : '#fdecea', // Green or red tint
    };

    return (
      <View style={cardStyle}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subText}>Default: {item.defaultLocation}</Text>
        <Text style={styles.subText}>Current: {item.currentLocation}</Text>
        {!item.sameLocation && (
          <Text style={styles.dateLine}>
            {item.date1}  |  {item.date2}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={statusData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => navigation.replace("UserDashboard")}
          style={[styles.bottomBarButton, currentRoute === "UserDashboard" && styles.activeButton]}
        >
          <Text style={currentRoute === "UserDashboard" ? styles.activeText : styles.inactiveText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace("AdminDashboard")}
          style={[styles.bottomBarButton, currentRoute === "AdminDashboard" && styles.activeButton]}
        >
          <Text style={currentRoute === "AdminDashboard" ? styles.activeText : styles.inactiveText}>Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace("ProfilePage")}
          style={[styles.bottomBarButton, currentRoute === "ProfilePage" && styles.activeButton]}
        >
          <Text style={currentRoute === "ProfilePage" ? styles.activeText : styles.inactiveText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace("Travel Status")}
          style={[styles.bottomBarButton, currentRoute === "Travel Status" && styles.activeButton]}
        >
          <Text style={currentRoute === "Travel Status" ? styles.activeText : styles.inactiveText}>Status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StatusPage;
