import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25
    },
    textInput: {
        flex: 1,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    textInputCustomer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
        marginBottom: 15,
    },
    textInputPrice: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 2,
        padding: 0,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    dropDownBtn: {
        width: '15%',
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginRight: 5,
        marginLeft: 5,
        paddingLeft: 0,
        paddingRight: 0
    },
    dropDownBtn2: {
        backgroundColor: '#fff',
        width: '48%',
        padding: 0,
        borderRadius: 10,
    },
    dropDownBtnCustomer: {
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 10,
        padding: 0,
        height: 30
    },
    dropDownBtnText: {
        width: '80%',
        fontSize: 18,
        color: '#696969',
    },
    dropDownBtnText2: {
        fontSize: 14,
        color: '#696969',
    },
    dropdown: {
        backgroundColor: '#fff',
    },
    twoDropDownBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0,
        marginBottom: 15,
    },
    timeView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        marginBottom: 15,
    },
    labelText: {
        fontSize: 12,
        color: 'gray',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        width: '80%',
        marginLeft: '10%',
        marginTop: 10,
    },
    itemAdd: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 0,
        marginBottom: 15,
        backgroundColor: '#ccc',
    },
    addButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        textAlign: 'center',
        fontSize: 30,
    },
    asaderasText: {
        color: 'grey',
        fontSize: 16,
        marginTop: 10
    },
})
