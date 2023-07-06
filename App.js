import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import FlashMessage from 'react-native-flash-message';

import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import Constants from 'expo-constants';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AddCustomer from './src/screens/addCustomer';
import Items from './src/screens/items';
import CustomerDetails from './src/screens/customerDetails';
import AddAsadera from './src/screens/addAsadera';
import AsaderaDetails from './src/screens/asaderaDetails';
import Delivered from './src/screens/delivered';
import Records from './src/screens/records';

import { getRecord, getRecordPDF } from './src/js/caja';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(Constants.manifest.extra.appId, Constants.manifest.extra.jsKey);
Parse.serverURL = Constants.manifest.extra.serverUrl;

const Stack = createStackNavigator();

function LogoTitle() {
  const currentYear = new Date().getFullYear();
  return (
    <View>
      <Text style={styles.title}>Horno ({ currentYear })</Text>
    </View>
  )
}

function SimpleMenu() {
  const navigation = useNavigation();

  const openConfirmationAlert = async (n) => {
    if (n === 0)
      await getRecord();
    else 
      await getRecordPDF();
  }

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
              backgroundColor: '#ccc',
              zIndex: 10,
            },
            optionsWrapper: {
              backgroundColor: '#fff',
              position: 'absolute',
              left: 0,
              top: -20,
              zIndex: 10,
            },
          }}
        >
          <MenuOption onSelect={async () => await openConfirmationAlert(0)} text="Guardar registros" />
          <MenuOption onSelect={async () => await openConfirmationAlert(1)} text='Generar PDF' />
          <MenuOption onSelect={() => navigation.navigate('records')} text='Ver registros'/>
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
        },
        headerRightContainerStyle: {
          backgroundColor: '#2d2d2d',
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
              <SimpleMenu />
          ),
        }}
      />
      <Stack.Screen name='addCustomer' component={AddCustomer} options={({route}) => ({title: 'Nuevo Cliente'})} />
      <Stack.Screen name='customerDetails' component={CustomerDetails} options={{title: 'Cliente'}} />
      <Stack.Screen name='addAsadera' component={AddAsadera} options={({route}) => ({title: 'Nueva Asadera'})} />
      <Stack.Screen name='asaderaDetails' component={AsaderaDetails} options={{title: 'Asadera'}} />
      <Stack.Screen name='delivered' component={Delivered} options={{title: 'Cliente (entregado)'}} />
      <Stack.Screen name='records' component={Records} options={{title: 'Tabla de registros'}} />

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
    alignItems: 'flex-end',
    width: 150
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