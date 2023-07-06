import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, TextInput, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import { showMessage } from 'react-native-flash-message';

import Parse from "parse/react-native.js";

import { getHoursList, getMinutesList, getHourIndex, getTime } from '../js/time';

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
        objectId: '',
        full_name: '',
    });

    const getCustomerb4a = async (id) => {
        const query = new Parse.Query('clientes');
        query.contains('objectId', id);
        
        let result = await query.find();

        setCustomer({
            objectId: result[0].get('objectId'),
            full_name: result[0].get('full_name')
        });
    }

    const handleChangeText = (input, value) => {
        setAsadera({...asadera, [input]: value})
    }

    const handleChangeTime = (input, value) => {
        let time = asadera.entry_time.split(':');
        let new_time = getTime(time, input, value);
        setAsadera({...asadera, ['entry_time']: new_time});
    }

    const addAsadera = async () => {
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
                message: 'Por favor, asigne a un cliente',
                type: 'warning',
                icon: 'warning',
                position: 'bottom'
            });
        }
        else if (asadera.oven === '') {
            showMessage({
                message: 'Por favor, seleccione un horno',
                type: 'warning',
                icon: 'warning',
                position: 'bottom'
            });
        }
        else {
            try {
                let newAsadera = new Parse.Object('asaderas');
                newAsadera.set('content', asadera.content);
                newAsadera.set('description', asadera.description);
                newAsadera.set('customer_id', asadera.customer_id);
                newAsadera.set('oven', asadera.oven);
                newAsadera.set('entry_time', asadera.entry_time);
                newAsadera.set('state', asadera.state);
                await newAsadera.save();
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
        getCustomerb4a(route.params.customer_id);
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
                <Button title='Guardar' onPress={() => addAsadera()} />
            </View>
        </ScrollView>
    );
}

export default AddAsadera;