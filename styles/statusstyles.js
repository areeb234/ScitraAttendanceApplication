import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
      paddingHorizontal: 8,
      paddingTop: 40,
      marginTop : 20
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 12, // <-- Add this for left and right spacing
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      
    name: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 6,
    },
    subText: {
      fontSize: 14,
      color: '#555',
      marginBottom: 4,
    },
    dateLine: {
      marginTop: 8,
      fontSize: 13,
      color: '#888',
    },

    bottomBar: {
    flexDirection: "row",
    bottom: Platform.OS === 'android' ? 20 : 0, // Push up from Android nav
    justifyContent: "space-around", // Ensures even spacing
    alignItems: "center",
    paddingVertical: 18,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100vh",
    left: 0,  // Ensure it starts from the left
    right: 0, // Ensure it stretches to the right
  },
bottomBarButton: {
      bottom : 10,
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
});

export default styles;
