import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, TextInput, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import { showMessage } from 'react-native-flash-message';

import { collection, addDoc, getDoc, doc } from "firebase/firestore"; 
import db from '../../database/firebase';

import { getHoursList, getMinutesList, getHourIndex } from '../js/time';

import { formStyles } from '../styles/forms';

const AddAsadera = ({route, navigation}) => {
    const content = useRef(null);
    const description = useRef(null);
    const currentTime = new Date();

    const initialState = {
        customer_id: route.params.customer_id,
        content: '',
        description: '',
        oven: 0,
        entry_time: currentTime.getHours() + ':' + currentTime.getMinutes(),
        state: 0
    };
    const [asadera, setAsadera] = useState(initialState);
    const [customer, setCustomer] = useState({
        id: '',
        full_name: '',
    });

    const getCustomer = async (id) => {
        try {
            const docRef = doc(db, 'clientes', id);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                const {full_name} = docSnap.data();
                setCustomer({id: docSnap.id, full_name});
            } else {
                showMessage({
                    message: 'No existen datos del usuario',
                    type: 'default',
                    icon: 'default',
                    position: 'bottom'
                });
            }
        } catch(error) {
            throw error;
        }
    }
/*
    const getCustomerIndex = (customers_id, customer_id) => {
        for (let i = 0; i < customers_id.length; i++) {
            if (customers_id[i] === customer_id) return i;
        }
        return 0;
    }

    const getCustomers = async () => {
        const docRef = collection(db, 'clientes');
        const docSnap = await getDocs(docRef);
        let customers = [];
        let customersId = [];
        docSnap.forEach((doc) => {
            const customer = doc.data();
            customers.push(customer.full_name.toUpperCase());
            customersId.push(doc.id);
        });
        setCustomers(customers);
        setCustomersId(customersId);
        setCustomerIndex(getCustomerIndex(customersId, route.params.customer_id));
    }
*/
    const handleChangeText = (input, value) => {
        setAsadera({...asadera, [input]: value})
    }

    const handleChangeTime = (input, value) => {
        let time = asadera.entry_time.split(':');
        let new_time = '';
        if (input === 'hour') {
            new_time += value + ':' + time[1];
        }
        else if (input === 'minute') {
            new_time += time[0] + ':' + value;
        }
        else if (input === 'ampm') {
            if (value === 'PM' && parseInt(time[0]) < 12) {
                new_time += (parseInt(time[0]) + 12).toString() + ':' + time[1];
            }
            else if (value === 'AM' && parseInt(time[0]) === 12) {
                new_time += '00' + ':' + time[1];
            }
            else if (value === 'AM' && parseInt(time[0]) > 12) {
                new_time += (parseInt(time[0]) - 12).toString() + ':' + time[1];
            }
            else {
                new_time += time[0] + ':' + time[1];
            }
        }
        else {
            new_time += time[0] + ':' + time[1];
        }
        setAsadera({...asadera, ['entry_time']: new_time});
    }

    const addAsadera = async (customer_name = '[cliente]') => {
        if (asadera.content === '') {
            showMessage({
                message: 'Por favor, ingrese el contenido de la asadera',
                type: 'warning',
                icon: 'warning',
                position: 'bottom'
            });
        }
        else if (asadera.customer_id === '') {
            showMessage({
                message: 'Por favor, ingrese el contenido de la asadera',
                type: 'warning',
                icon: 'warning',
                position: 'bottom'
            });
        }
        else if (asadera.oven === '') {
            showMessage({
                message: 'Por favor, ingrese el contenido de la asadera',
                type: 'warning',
                icon: 'warning',
                position: 'bottom'
            });
        }
        else {
            try {
                const docRef = await addDoc(collection(db, 'asaderas'), asadera);
                showMessage({
                    message: 'Asadera agregada exitosamente!',
                    type: 'success',
                    icon: 'auto',
                    position: 'bottom'
                })
                content.current.clear();
                description.current.clear();
            }
            catch (error) {
                throw error;
            }
        }
    }

    const CurrentTime = () => (
        <View style={formStyles.timeView}>
            <Text style={formStyles.labelText}>{"Hora de ingreso :    "}</Text>
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
                rowTextStyle={{color: '#000'}}
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
                rowTextStyle={{color: '#000'}}
                selectedRowStyle={{backgroundColor: '#fff'}}
                selectedRowTextStyle={{color: '#000'}}
            />
        </View>
    );

    useEffect(() => {
        getCustomer(route.params.customer_id);
    }, []);

    return (
        <ScrollView style={formStyles.container}>
            <View style={formStyles.textInputCustomer}>
                <Text>{'Cliente :   ' + customer.full_name.toUpperCase()}</Text>
            </View>

            <View style={formStyles.textInput}>
                <TextInput
                    placeholder='Contenido'
                    ref={content}
                    id='content'
                    onChangeText={(value) => handleChangeText('content', value)}
                />
            </View>
            <View style={formStyles.textInput}>
                <TextInput
                    placeholder='Descripción'
                    ref={description}
                    id='description'
                    onChangeText={(value) => handleChangeText('description', value)}
                />
            </View>
            <View style={formStyles.twoDropDownBtn}>
                <SelectDropdown
                    data={['Horno 1', 'Horno 2']}
                    defaultValueByIndex={0}
                    onSelect={(selectedItem, index) => {
                        handleChangeText('oven', index);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                    buttonStyle={formStyles.dropDownBtn2}
                    rowTextStyle={{color: '#000'}}
                    selectedRowStyle={{backgroundColor: '#fff'}}
                    selectedRowTextStyle={{color: '#000'}}
                    renderDropdownIcon={isOpened => {
                      return <Icon name={isOpened ? 'expand-less' : 'expand-more'} color={'#a4a4a4'} size={18} />;
                    }}
                    dropdownIconPosition={'right'}
                />

                <SelectDropdown
                    data={['En espera', 'En horno', 'Listo']}
                    defaultValueByIndex={0}
                    onSelect={(selectedItem, index) => {
                        handleChangeText('state', index);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                    buttonStyle={formStyles.dropDownBtn2}
                    rowTextStyle={{color: '#000'}}
                    selectedRowStyle={{backgroundColor: '#fff'}}
                    selectedRowTextStyle={{color: '#000'}}
                    renderDropdownIcon={isOpened => {
                      return <Icon name={isOpened ? 'expand-less' : 'expand-more'} color={'#a4a4a4'} size={18} />;
                    }}
                    dropdownIconPosition={'right'}
                />
            </View>

            <CurrentTime />

            <View style={formStyles.button}>
                <Button title='Guardar' onPress={() => addAsadera(customer.full_name)} />
            </View>
        </ScrollView>
    );
}

export default AddAsadera;