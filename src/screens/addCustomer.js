import React, { useState } from 'react';
import { View, Button, Text, TextInput, ScrollView, Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { StackActions } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import { collection, addDoc } from "firebase/firestore";
import db from '../../database/firebase';

import { getHourIndex, getHoursList, getMinutesList } from '../js/time';

import { formStyles } from '../styles/forms';

const AddCustomer = ({route, navigation}) => {
    const currentTime = new Date();
    const [customer, setCustomer] = useState({
        full_name: '',
        price: .0,
        phone: 0,
        arrival_time: currentTime.getHours() + ':' + currentTime.getMinutes(),
        state: 0,
    });

    const handleChangeText = (input, value) => {
        setCustomer({...customer, [input]: value})
    }

    const handleChangeTime = (input, value) => {
        let time = customer.arrival_time.split(':');
        if (input === 'hour') {
            customer.arrival_time = value + ':' + time[1];
        }
        else if (input === 'minute') {
            customer.arrival_time = time[0] + ':' + value;
        }
        else if (input === 'ampm') {
            if (value === 'PM' && parseInt(time[0]) < 12) {
                customer.arrival_time = (parseInt(time[0]) + 12).toString() + ':' + time[1];
            }
            else if (value === 'AM' && parseInt(time[0]) === 12) {
                customer.arrival_time = '00' + ':' + time[1];
            }
            else if (value === 'AM' && parseInt(time[0]) > 12) {
                customer.arrival_time = (parseInt(time[0]) - 12).toString() + ':' + time[1];
            }
            else {
                customer.arrival_time = time[0] + ':' + time[1];
            }
        }
        else {
            customer.arrival_time = time[0] + ':' + time[1];
        }
    }

    const addCustomer = async () => {
        if (customer.full_name === '') {
            showMessage({
                message: 'Ingrese un nombre de cliente!',
                type: 'warning',
                position: 'bottom',
                icon: 'auto'
            });
        }
        else {
            try {
                const c = {
                    full_name: customer.full_name,
                    price: customer.price,
                    phone: customer.phone,
                    arrival_time: customer.arrival_time,
                    state: customer.state
                }
                const docRef = await addDoc(collection(db, 'clientes'), c);
                showMessage({
                    message: `Cliente agregado: ${c.full_name} (${docRef.id})`,
                    type: 'success',
                    position: 'bottom',
                    icon: 'auto',
                    duration: 3000
                })
                const popAction = StackActions.pop(1);
                navigation.dispatch(popAction);
                navigation.navigate('addAsadera', {customer_id: docRef.id});
            }
            catch (error) {
                throw error;
            }
        }
    }

    return (
        <ScrollView style={formStyles.container}>
            <View style={formStyles.textInput}>
                <TextInput
                    placeholder='Nombre'
                    onChangeText={(value) => handleChangeText('full_name', value)}
                />
            </View>
            <View style={formStyles.textInputPrice}>
                <Text style={formStyles.labelText}>S/</Text>
                <TextInput
                    placeholder='Precio'
                    onChangeText={(value) => handleChangeText('price', parseFloat(value))}
                    keyboardType='numeric'
                />
                <Text style={formStyles.labelText}>.00</Text>
            </View>
            <View style={formStyles.textInput}>
                <TextInput
                    placeholder='Teléfono'
                    onChangeText={(value) => handleChangeText('phone', parseInt(value))}
                    keyboardType='numeric'
                />
            </View>

            <View style={formStyles.timeView}>
                <Text style={formStyles.labelText}>{"Hora de llegada :    "}</Text>
                <SelectDropdown
                    data={getHoursList()}
                    defaultValueByIndex={getHourIndex(currentTime.getHours())}
                    onSelect={(selectedItem, index) => {
                        handleChangeTime('hour', selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                    buttonStyle={formStyles.dropDownBtn}
                    buttonTextStyle={formStyles.dropDownBtnText}
                    dropdownStyle={formStyles.dropdown}
                    rowTextStyle={{color: '#696969'}}
                    selectedRowStyle={{backgroundColor: '#fff'}}
                    selectedRowTextStyle={{color: '#000'}}
                />

                <Text style={formStyles.labelText}>{":"}</Text>
                
                <SelectDropdown
                    data={getMinutesList()}
                    defaultValueByIndex={currentTime.getMinutes()}
                    onSelect={(selectedItem, index) => {
                        handleChangeTime('minute', selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    buttonStyle={formStyles.dropDownBtn}
                    buttonTextStyle={formStyles.dropDownBtnText}
                    dropdownStyle={formStyles.dropdown}
                    rowTextStyle={{color: '#696969'}}
                    selectedRowStyle={{backgroundColor: '#fff'}}
                    selectedRowTextStyle={{color: '#000'}}
                />
                <SelectDropdown
                    data={['AM', 'PM']}
                    defaultValueByIndex={(currentTime.getHours() < 12) ? 0 : 1}
                    onSelect={(selectedItem, index) => {
                        handleChangeTime('ampm', selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                    buttonStyle={formStyles.dropDownBtn}
                    buttonTextStyle={formStyles.dropDownBtnText2}
                    dropdownStyle={formStyles.dropdown}
                    rowTextStyle={{color: '#696969'}}
                    selectedRowStyle={{backgroundColor: '#fff'}}
                    selectedRowTextStyle={{color: '#000'}}
                />
            </View>

            <View style={formStyles.button}>
                <Button title='Guardar' onPress={() => addCustomer()} />
            </View>
        </ScrollView>
    )
}

export default AddCustomer;