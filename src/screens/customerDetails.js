import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import { showMessage } from 'react-native-flash-message';

import Parse from "parse/react-native.js";

import { getHoursList, getMinutesList, getHourIndex, getTimeText, getTime } from '../js/time';

import { formStyles } from '../styles/forms';

const CustomerDetails = (props) => {
    const currentTime = new Date();
    const [isDisabled, setIsDisabled] = useState(true);
    const initialState = {
        objectId: '',
        full_name: '',
        price: .0,
        phone: 0,
        arrival_time: currentTime.getHours() + ':' + currentTime.getMinutes(),
        state: 0
    }
    const [customer, setCustomer] = useState(initialState);
    const [asaderas, setAsaderas] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCustomerb4a = async (id) => {
        const parseQuery = new Parse.Query('clientes');
        parseQuery.contains('objectId', id);

        let result = await parseQuery.find();
        let c = {...customer};
        c.objectId = result[0].id;
        c.full_name = result[0].get('full_name');
        c.price = result[0].get('price');
        c.phone = result[0].get('phone');
        c.arrival_time = result[0].get('arrival_time');
        c.state = result[0].get('state');
        setCustomer(c);
        setLoading(false);
    }

    const getAsaderasb4a = async (customer_id) => {
        const parseQuery = new Parse.Query('asaderas');
        parseQuery.contains('customer_id', customer_id);

        let results = await parseQuery.find();
        setAsaderas(results.map(result => result.toJSON()));
    }

    const handleChangeText = (input, value) => {
        setCustomer({...customer, [input]: value});
        setIsDisabled(false);
    }

    const handleChangeTime = (input, value) => {
        let time = customer.arrival_time.split(':');
        let new_time = getTime(time, input, value);
        setCustomer({...customer, ['arrival_time']: new_time});
        setIsDisabled(false);
    }

    const updateCustomerb4a = async () => {
        const parseQuery = new Parse.Query('clientes');
        parseQuery.contains('objectId', customer.objectId);

        let result = await parseQuery.find();
        result[0].set('full_name', customer.full_name);
        result[0].set('price', customer.price);
        result[0].set('phone', customer.phone);
        result[0].set('arrival_time', customer.arrival_time);
        await result[0].save();
        showMessage({
            message: 'Cambios guardados',
            type: 'success',
            icon: 'auto',
            position: 'bottom',
            duration: 3000
        });
        setIsDisabled(true);
    }

    const deliverToCustomer = async () => {
        const parseQuery = new Parse.Query('clientes');
        parseQuery.contains('objectId', customer.objectId);

        let result = await parseQuery.find();
        result[0].set('state', 1);
        await result[0].save();
        await switchCustomerAsaderasState(2);
        showMessage({
            message: 'Entregado!!!',
            type: 'success',
            icon: 'auto',
            position: 'bottom',
            duration: 3000
        });
        props.navigation.navigate('items');
    }

    const switchCustomerAsaderasState = async (state) => {
        const query = new Parse.Query('asaderas');
        query.contains('customer_id', customer.objectId);
        
        let results = await query.find();
        results.forEach(async (result) => {
            result.set('state', state);
            await result.save();
        });
    }

    const deleteCustomer = async () => {
        await deleteAsaderas();
        const parseQuery = new Parse.Query('clientes');
        parseQuery.contains('objectId', customer.objectId);

        let result = await parseQuery.find();
        await result[0].destroy();
        showMessage({
            message: 'Cliente eliminado de la BD',
            type: 'success',
            icon: 'auto',
            position: 'bottom'
        })
        props.navigation.navigate('items');
    }

    const deleteAsaderas = async () => {
        const query = new Parse.Query('asaderas');
        query.contains('customer_id', customer.objectId);
        
        let results = await query.find();
        results.forEach(async (result) => {
            await result.destroy();
        });
    }

    const openConfirmationAlert = () => {
        Alert.alert('Alerta', '¿Seguro que quieres eliminar los datos de este cliente?', [
            {text: 'Sí', onPress: () => deleteCustomer()},
            {text: 'No', onPress: () => {return ;}}
        ], Option={cancelable:true});
    }

    useEffect(() => {
        getCustomerb4a(props.route.params.customer_id);
        getAsaderasb4a(props.route.params.customer_id);
        const focusHandler = props.navigation.addListener('focus', async () => {
            await getCustomerb4a(props.route.params.customer_id);
            await getAsaderasb4a(props.route.params.customer_id);
          });
        return focusHandler;
    }, [])

    if (loading === true) {
        return (<View>
            <ActivityIndicator size="large" color="#9e9e9e" />
        </View>);
    }

    return (
        <ScrollView style={formStyles.container}>
            <View style={formStyles.textInput}>
                <TextInput
                    placeholder='Nombre'
                    value={customer.full_name}
                    onChangeText={(value) => handleChangeText('full_name', value)}
                />
            </View>
            <View style={formStyles.textInputPrice}>
                <Text>S/</Text>
                <TextInput
                    placeholder='Precio'
                    value={(customer.price > 0 ? customer.price.toString() : '')}
                    onChangeText={(value) => handleChangeText('price', value === '' ? .0 : parseFloat(value))}
                    keyboardType='numeric'
                />
                <Text>.00</Text>
            </View>
            <View style={formStyles.textInput}>
                <TextInput
                    placeholder='Teléfono'
                    value={customer.phone > 0 ? customer.phone.toString() : ''}
                    onChangeText={(value) => handleChangeText('phone', parseInt(value))}
                    keyboardType='numeric'
                />
            </View>
            <View style={formStyles.timeView}>
                <Text style={formStyles.labelText}>{"Hora de llegada :    "}</Text>
                <SelectDropdown
                    data={getHoursList()}
                    defaultValueByIndex={getHourIndex(parseInt(customer.arrival_time.split(':')[0]))}
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
                    rowTextStyle={{color: '#000'}}
                    selectedRowStyle={{backgroundColor: '#fff'}}
                    selectedRowTextStyle={{color: '#000'}}
                />
                
                <Text style={formStyles.labelText}>{":"}</Text>
                
                <SelectDropdown
                    data={getMinutesList()}
                    defaultValueByIndex={parseInt(customer.arrival_time.split(':')[1])}
                    onSelect={(selectedItem, index) => {
                        handleChangeTime('minute', selectedItem);
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
                    rowTextStyle={{color: '#000'}}
                    selectedRowStyle={{backgroundColor: '#fff'}}
                    selectedRowTextStyle={{color: '#000'}}
                />
                <SelectDropdown
                    data={['AM', 'PM']}
                    defaultValueByIndex={(parseInt(customer.arrival_time.split(':')[0]) < 12) ? 0 : 1}
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
                    rowTextStyle={{color: '#000'}}
                    selectedRowStyle={{backgroundColor: '#fff'}}
                    selectedRowTextStyle={{color: '#000'}}
                />
            </View>

            <View style={formStyles.button}>
                <Button title='Actualizar' disabled={isDisabled} onPress={() => updateCustomerb4a()} />
            </View>
            <View style={formStyles.button}>
                <Button title='Entregar' onPress={() => deliverToCustomer()} />
            </View>
            <View style={formStyles.button}>
                <Button title='Eliminar' color="#ec0000" onPress={() => openConfirmationAlert()} />
            </View>
            
            <View>
                <Text style={formStyles.asaderasText}>Asadera(s) [{asaderas.length}]:</Text>
            {
                asaderas.map(asadera => (
                    <ListItem
                        key={asadera.objectId}
                        onPress={() => props.navigation.navigate('asaderaDetails', {asadera_id: asadera.objectId, full_name: customer.full_name})}
                    >
                        <ListItem.Content>
                            <ListItem.Title>
                                {asadera.content + ' (' + getTimeText(asadera.entry_time) + ')'}
                            </ListItem.Title>
                            <ListItem.Subtitle>{asadera.description}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
                <ListItem
                    style={formStyles.itemAdd}
                    onPress={() => props.navigation.navigate('addAsadera', {customer_id: props.route.params.customer_id})}
                >
                    <Icon
                        name='add'
                        color='#ff8f00'
                        containerStyle={formStyles.addButton}
                        iconStyle={formStyles.addIcon}
                    />
                </ListItem>
            </View>
        </ScrollView>
    );
}

export default CustomerDetails;