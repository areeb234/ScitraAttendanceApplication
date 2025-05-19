import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#555',
    },
    value: {
      fontSize: 16,
      color: '#222',
      fontWeight: '500',
    },
    logoutButton: {
      marginTop: 20,
      backgroundColor: '#d9534f',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around", // Ensures even spacing
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    paddingBottom: Platform.OS === 'android' ? 0 : 8, // adaptively pad
    bottom: 0,
    width: "100vh",
    left: 0,  // Ensure it starts from the left
    right: 0, // Ensure it stretches to the right
  },


    bottomBarButton: {
      flex: 1,  // Remove if you don't want to stretch the button
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 6,  // Control padding on all sides
    },



    bottomBarText: {
    fontSize: 14,
    color: "#333",
  },
      activeButton: {
        backgroundColor: "#ddd",  // Highlight color for the active button
        borderRadius: 10,
        paddingVertical: 6,  // Reduced padding for top and bottom
        paddingHorizontal: 5,  // Adjust horizontal padding
        justifyContent: 'center',  // Center text vertically
        alignItems: 'center',  // Center text horizontally
        width: 'auto', // Allow width to adjust based on content
      },
      deleteButton: {
        marginTop: 20,
        backgroundColor: '#d9534f',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      deleteText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },

      modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      confirmButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
      },
      confirmText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
      },
      cancelText: {
        color: '#333',
        fontWeight: 'bold',
      },

  });
  export default styles;
