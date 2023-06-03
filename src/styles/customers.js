import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    filter: {
      height: '8%',
      backgroundColor: '#0f0f0f',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    filterBtn: {
      height: '50%',
      width: '40%',
      marginHorizontal: '30%',
      paddingHorizontal: 0,
      marginVertical: 10,
      borderRadius: 5,
      backgroundColor: '#2d2d2d',
    },
    filterBtnText: {
      color: '#fff',
      fontSize: 15,
    },
    addButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: 50,
      height: 50,
      position: 'absolute',
      right: '5%',
      bottom: '5%',
      borderRadius: 25,
      transform: [{translateX: -5}, {translateY: -5}],
      backgroundColor: '#0f0f0f'
    },
    addIcon: {
      textAlign: 'center',
      fontSize: 30
    },
    phoneView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    phoneIconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
      padding: 0,
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    phoneIcon: {
      textAlign: 'center',
      fontSize: 14
    },
});