import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 5, // Prevent text from touching edges
  },

  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 5, 
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
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
  plusButtonText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
  },

  closeButtonRight: {
    backgroundColor: '#ccc',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15,
    width: '85%',
    maxWidth: 400,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  pickerContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 1000,
    elevation: 10,
    borderRadius: 5,
  },
  picker: {
    height: 150,
    width: '100%',
  },
  dateInput: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  
  closeButtonLeft: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownTrigger: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  
  dropdownContainer1: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 10,
    maxHeight: '50%',
  },
  
  dropdownText: {
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  
  itemText: {
    fontSize: 16,
    textAlign: 'left',
    color: '#333',
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around", // Ensures even spacing
    alignItems: "center",
    bottom: Platform.OS === 'android' ? 20 : 0, // Push up from Android nav
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
