import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
 import FlashMessage from 'react-native-flash-message';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AddCustomer from './src/screens/addCustomer';
import Items from './src/screens/items';
import CustomerDetails from './src/screens/customerDetails';
import AddAsadera from './src/screens/addAsadera';
import AsaderaDetails from './src/screens/asaderaDetails';
import Delivered from './src/screens/delivered';

import { getSummary, getTotalCustomers } from './src/js/caja';

const Stack = createStackNavigator();

function LogoTitle() {
  const currentYear = new Date().getFullYear();
  return (
    <View>
      <Text style={styles.title}>Oven Manager App ({ currentYear })</Text>
    </View>
  )
}

function SimpleMenu() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  
  const openConfirmationAlert = () => {
    if (totalCustomers._z > 0) {
      Alert.alert('Alerta', 'Esta función borrará los datos actuales. ¿Deseas continuar?', [
          {text: 'Sí', onPress: () => getSummary()},
          {text: 'No', onPress: () => {return ;}}
      ]);
    }
    else {
      Alert.alert('No hay datos que registrar por hoy.');
    }
  }

  useEffect(() => {
    setTotalCustomers(getTotalCustomers());
  }, [])

  return (
    <MenuProvider style={styles.container}>
      <Menu>
        <MenuTrigger
          customStyles={{
            triggerWrapper: {
              top: 0,
              right: 0,
            },
          }}
        >
          <Icon
            name='more-vert'
            iconStyle={{textAlign: 'center', fontSize: 20, color: '#fff'}}
            containerStyle={{
              width: 40,
              height: 40,
              padding: 8,
              borderRadius: 5,}}
          />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              position: 'absolute',
              marginTop: 16,
              marginRight: 10,
              left: 10,
              backgroundColor: '#ccc',
              zIndex: 10,
            },
            optionsWrapper: {
              backgroundColor: '#fff',
              marginRight: 10,
            },
          }}
        >
          <MenuOption onSelect={() => openConfirmationAlert()} text="Guardar registros" />
        </MenuOptions>
      </Menu>
    </MenuProvider>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2d2d2d',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        }
      }}
      initialRouteName='items'
    >
      <Stack.Screen 
        name='items'
        component={Items}
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            <View>
              <SimpleMenu />
            </View>
          ),
        }}
      />
      <Stack.Screen name='addCustomer' component={AddCustomer} options={({route}) => ({title: 'Nuevo Cliente'})} />
      <Stack.Screen name='customerDetails' component={CustomerDetails} options={{title: 'Cliente'}} />
      <Stack.Screen name='addAsadera' component={AddAsadera} options={({route}) => ({title: 'Nueva Asadera'})} />
      <Stack.Screen name='asaderaDetails' component={AsaderaDetails} options={{title: 'Asadera'}} />
      <Stack.Screen name='delivered' component={Delivered} options={{title: 'Cliente (entregado)'}} />

    </Stack.Navigator>
  )
}

export default function App() {
  return (<>
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
    <FlashMessage />
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

/*
          headerLeft: () => (
            <Button
              onPress={(props) => {props.navigation.navigate('addCustomer')}}
              title='+'
              color='orange'
            />
          )*/