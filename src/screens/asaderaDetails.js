import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, TextInput, ScrollView, Alert, Pressable, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import { showMessage } from 'react-native-flash-message';

import { collection, doc, getDoc, updateDoc } from "firebase/firestore"; 
import db from '../../database/firebase';

import { getHoursList, getMinutesList, getHourIndex } from '../js/time';

import { formStyles } from '../styles/forms';

const AsaderaDetails = ({route, navigation}) => {
    const content = useRef(null);
    const description = useRef(null);
    const currentTime = new Date();
    const [loading, setLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);

    const initialState = {
        customer_id: '',
        content: '',
        description: '',
        oven: 0,
        entry_time: currentTime.getHours() + ':' + currentTime.getMinutes(),
        state: 0
    };
    const [asadera, setAsadera] = useState(initialState);

    const getAsadera = async (id) => {
        try {
            const docRef = doc(db, 'asaderas', id)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                const {customer_id, content, description, entry_time, oven, state} = docSnap.data();
                setAsadera({id: docSnap.id, customer_id, content, description, entry_time, oven, state});
                setLoading(false);
            } else {
                Alert.alert('No existen datos de la asadera');
            }
        } catch(error) {
            throw error;
        }
    }

    const updateAsadera = async () => {
        if (asadera.content === '') {
            alert('Por favor, ingrese el contenido de la asadera');
        }
        else {
            try {
                const dbRef = doc(db, 'asaderas', asadera.id);
                await updateDoc(dbRef, asadera)
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
    
    const handleChangeText = (input, value) => {
        setAsadera({...asadera, [input]: value});
        setIsDisabled(false);
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
        setIsDisabled(false);
    }

    const openConfirmationAlert = () => {
        Alert.alert('¿Seguro que quieres eliminar esta asadera?', [
            {text: 'Sí', onPress: () => deleteItem()},
            {text: 'No', onPress: () => console.log('cancelado')}
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
        getAsadera(route.params.asadera_id);
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