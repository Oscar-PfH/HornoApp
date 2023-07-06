import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, TextInput, ScrollView, Alert, Pressable, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import { showMessage } from 'react-native-flash-message';

import Parse from "parse/react-native.js";

import { getHoursList, getMinutesList, getHourIndex, getTime } from '../js/time';

import { formStyles } from '../styles/forms';

const AsaderaDetails = ({route, navigation}) => {
    const content = useRef(null);
    const description = useRef(null);
    const currentTime = new Date();
    const [loading, setLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);

    const initialState = {
        objectId: '',
        customer_id: '',
        content: '',
        description: '',
        oven: 0,
        entry_time: currentTime.getHours() + ':' + currentTime.getMinutes(),
        state: 0
    };
    const [asadera, setAsadera] = useState(initialState);

    const getAsaderab4a = async (id) => {
        const query = new Parse.Query('asaderas');
        query.contains('objectId', id);

        const result = await query.find();

        setAsadera({
            objectId: result[0].id,
            customer_id: result[0].get('customer_id'),
            content: result[0].get('content'),
            description: result[0].get('description'),
            oven: result[0].get('oven'),
            entry_time: result[0].get('entry_time'),
            state: result[0].get('state')
        })
        setLoading(false);
    }

    const updateAsadera = async () => {
        if (asadera.content === '') {
            alert('Por favor, ingrese el contenido de la asadera');
        }
        else {
            try {
                const parseQuery = new Parse.Query('asaderas');
                parseQuery.contains('objectId', asadera.objectId);

                let result = await parseQuery.find();
                result[0].set('content', asadera.content);
                result[0].set('description', asadera.description);
                result[0].set('customer_id', asadera.customer_id);
                result[0].set('oven', asadera.oven);
                result[0].set('entry_time', asadera.entry_time);
                result[0].set('state', asadera.state);
                await result[0].save();
                showMessage({
                    message: `Se guardaron los cambios`,
                    type: 'success',
                    position: 'bottom',
                    icon: 'auto',
                    duration: 3000
                })
                setIsDisabled(true);
            }
            catch (error) {
                throw error;
            }
        }
    }

    const deleteAsadera = async () => {
        const parseQuery = new Parse.Query('asaderas');
        parseQuery.contains('objectId', asadera.objectId);

        let result = await parseQuery.find();
        await result[0].destroy();
        showMessage({
            message: 'Asadera eliminada de la BD',
            type: 'success',
            icon: 'auto',
            position: 'bottom'
        })
        props.navigation.navigate('customerDetails', {customer_id: asadera.customer_id});
    }
    
    const handleChangeText = (input, value) => {
        setAsadera({...asadera, [input]: value});
        setIsDisabled(false);
    }

    const handleChangeTime = (input, value) => {
        let time = asadera.entry_time.split(':');
        let new_time = getTime(time, input, value);
        setAsadera({...asadera, ['entry_time']: new_time});
        setIsDisabled(false);
    }

    const openConfirmationAlert = () => {
        Alert.alert('¿Seguro que quieres eliminar esta asadera?', [
            {text: 'Sí', onPress: () => deleteAsadera()},
            {text: 'No', onPress: () => {return;}}
        ]);
    }

    const CurrentTime = () => (
        <View style={formStyles.timeView}>
            <Text style={formStyles.labelText}>{"Hora de ingreso :    "}</Text>
            <SelectDropdown
                data={getHoursList()}
                defaultValueByIndex={getHourIndex(parseInt(asadera.entry_time.split(':')[0]))}
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
                defaultValueByIndex={parseInt(asadera.entry_time.split(':')[1])}
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
                defaultValueByIndex={(parseInt(asadera.entry_time.split(':')[0]) < 12) ? 0 : 1}
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
        getAsaderab4a(route.params.asadera_id);
    }, []);

    if (loading === true) {
        return (<View>
            <ActivityIndicator size="large" color="#9e9e9e" />
        </View>);
    }

    return (
        <ScrollView style={formStyles.container}>
            <View style={formStyles.textInputCustomer}>
                <Text>{'Cliente :   ' + JSON.stringify(route.params.full_name).toUpperCase()}</Text>
            </View>

            <View style={formStyles.textInput}>
                <TextInput
                    placeholder='Contenido'
                    value={asadera.content}
                    ref={content}
                    id='content'
                    onChangeText={(value) => handleChangeText('content', value)}
                />
            </View>
            <View style={formStyles.textInput}>
                <TextInput
                    placeholder='Descripción'
                    value={asadera.description}
                    ref={description}
                    id='description'
                    onChangeText={(value) => handleChangeText('description', value)}
                />
            </View>
            <View style={formStyles.twoDropDownBtn}>
                <SelectDropdown
                    data={['Horno 1', 'Horno 2']}
                    defaultValueByIndex={asadera.oven}
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
                    defaultValueByIndex={asadera.state}
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
                <Button title='Actualizar' disabled={isDisabled} onPress={() => updateAsadera()} />
            </View>
            <View style={formStyles.button}>
                <Button title='Eliminar' color="#ec0000" onPress={() => openConfirmationAlert()} />
            </View>
        </ScrollView>
    );
}

export default AsaderaDetails;