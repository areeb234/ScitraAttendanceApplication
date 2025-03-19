import React, {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import axios from 'axios';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.post(
        'https://script.google.com/macros/s/AKfycbxphMskRAVLWG5gfRCeHxwyoWgAV7GjecUMq4hygR9s5zPmD5W2Vvsl1sJ37TbMcNY/exec',
        {
          action: 'adminDashboard',
        },
      );

      if (response.data.status === 'success') {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Admin Dashboard</Text>
      <FlatList
        data={Object.keys(dashboardData)}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <View>
            <Text>
              {item}: {dashboardData[item]} days
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default AdminDashboard;
