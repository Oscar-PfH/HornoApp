import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import { showMessage } from 'react-native-flash-message';

import db from '../../database/firebase';
import { collection, doc, getDoc, updateDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

import { getHoursList, getMinutesList, getHourIndex, getTimeText } from '../js/time';

import { formStyles } from '../styles/forms';

const Delivered = (props) => {
    const currentTime = new Date();
    const initialState = {
        id: '',
        full_name: '',
        price: .0,
        phone: 0,
        arrival_time: currentTime.getHours() + ':' + currentTime.getMinutes(),
        state: 0
    }
    const [customer, setCustomer] = useState(initialState);
    const [asaderas, setAsaderas] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCustomer = async (id) => {
        try {
            const docRef = doc(db, 'clientes', id)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                const {full_name, price, phone, arrival_time, state} = docSnap.data();
                setCustomer({id: docSnap.id, full_name, price, phone, arrival_time, state});
                setLoading(false);
            } else {
                Alert.alert('No existen datos');
            }
        } catch(error) {
            throw error;
        }
    }

    const getCustomerb4a = async (id) => {
        const parseQuery = new Parse.Query('clientes');
        parseQuery.contains('objectId', id);

        let result = await parseQuery.find();

        setCustomer({
            objectId: result[0].id,
            full_name: result[0].get('full_name'),
            price: result[0].get('price'),
            phone: result[0].get('phone'),
            arrival_time: result[0].get('arrival_time'),
            state: result[0].get('state')
        });
        setLoading(false);
    }

    const getAsaderas = async (customer_id) => {
        const qry = query(collection(db, 'asaderas'), where('customer_id', '==', customer_id));
        const docSnap = await getDocs(qry);
        let asaderas = [];
        docSnap.forEach(doc => {
            const {customer_id, content, description, oven, entry_time, state} = doc.data();
            asaderas.push({
                id: doc.id, customer_id, content, description, oven, entry_time, state
            });
        });
        setAsaderas(asaderas);
    }

    const getAsaderasb4a = async (customer_id) => {
        const parseQuery = new Parse.Query('asaderas');
        parseQuery.contains('customer_id', customer_id);

        let results = await parseQuery.find();
        setAsaderas(results.map(result => result.toJSON()));
    }

    const handleChangeTime = (input, value) => {
        let time = customer.arrival_time.split(':');
        if (input === 'hour') {
            customer.arrival_time = value + ':' + time[1];
        }
        else if (input === 'minute') {
            customer.arrival_time = time[0] + ':' + value;
        }
        else {
            customer.arrival_time = time[0] + ':' + time[1];
        }
        setIsDisabled(false);
    }

    const retrieveCustomer = async () => {
        /*const dbRef = doc(db, 'clientes', customer.id);
        await updateDoc(dbRef, {
            state: 0
        });
        await switchCustomerAsaderasState(0);*/

        const parseQuery = new Parse.Query('clientes');
        parseQuery.contains('objectId', customer.objectId);

        let result = await parseQuery.find();
        result[0].set('state', 0);
        await result[0].save();
        await switchCustomerAsaderasState(0);
        
        showMessage({
            message: 'Cliente restablecido',
            type: 'success',
            icon: 'auto',
            position: 'bottom',
            duration: 3000
        });
        props.navigation.navigate('items');
    }

    const switchCustomerAsaderasState = async (state) => {
        /*for (let i = 0; i < asaderas.length; i++) {
            const dbRef = doc(db, 'asaderas', asaderas[i].id);
            await updateDoc(dbRef, {
                state: state
            });
        }*/
        asaderas.forEach(async (asadera) => {
            asadera.set('state', state);
            await asadera.save();
        });
    }

    const deleteCustomer = async () => {
        await deleteAsaderas();
        await deleteDoc(doc(db, 'clientes', customer.id));
        props.navigation.navigate('items');
    }

    const deleteAsaderas = async () => {
        for (let i = 0; i < asaderas.length; i++) {
            await deleteDoc(doc(db, 'asaderas', asaderas[i].id));
        }
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
    }, [])

    if (loading === true) {
        return (<View>
            <ActivityIndicator size="large" color="#9e9e9e" />
        </View>);
    }

    return (
        <ScrollView style={formStyles.container}>
            <View style={formStyles.textInput}>
                <Text style={{paddingVertical: 5}}>{customer.full_name}</Text>
            </View>
            <View style={formStyles.textInputPrice}>
                <Text style={{paddingVertical: 5}}>{'S/' + customer.price.toString() + '.00'}</Text>
            </View>
            <View style={formStyles.textInput}>
                <Text style={{paddingVertical: 5}}>{customer.phone > 0 ? customer.phone.toString() : '--- --- ---'}</Text>
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
                    disabled={true}
                    buttonStyle={formStyles.dropDownBtn}
                    buttonTextStyle={formStyles.dropDownBtnText}
                    dropdownStyle={formStyles.dropdown}
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
                    disabled={true}
                    buttonStyle={formStyles.dropDownBtn}
                    buttonTextStyle={formStyles.dropDownBtnText}
                    dropdownStyle={formStyles.dropdown}
                />
                <SelectDropdown
                    data={['AM', 'PM']}
                    defaultValueByIndex={(parseInt(customer.arrival_time.split(':')[0]) < 12) ? 0 : 1}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                    disabled={true}
                    buttonStyle={formStyles.dropDownBtn}
                    buttonTextStyle={formStyles.dropDownBtnText2}
                    dropdownStyle={formStyles.dropdown}
                />
            </View>

            <View style={formStyles.button}>
                <Button title='Restablecer' onPress={() => retrieveCustomer()} />
            </View>
            <View style={formStyles.button}>
                <Button title='Eliminar' color="#ec0000" onPress={() => openConfirmationAlert()} />
            </View>
            
            <View>
                <Text style={formStyles.asaderasText}>Asadera(s) [{asaderas.length}]:</Text>
            {
                asaderas.map(asadera => (
                    <ListItem
                        key={asadera.id}
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
            </View>
        </ScrollView>
    );
}

export default Delivered;