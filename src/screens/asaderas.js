import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import Parse from "parse/react-native.js";

import { getCustomers } from "../controllers/customersController";
import { getAsaderasByOven } from "../controllers/asaderasController";

import Empty from './empty';

import { getTimeText } from "../js/time";

const Asaderas = (props) => {
  const states = ['En espera', 'En horno', 'Listo'];
  const icons = ['timelapse', 'fireplace', 'check-circle'];
  const colors = ['skyblue', '#ff5900', '#13ff00'];
  const [customers, setCustomers] = useState([]);
  const [asaderas, setAsaderas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getCustomersByState = async () => {
    const customers = await getCustomers(0);
    setCustomers(customers);
  }

  const getCustomersByStateb4a = async (state = 0) => {
    const query = new Parse.Query('clientes');
    query.equalTo('state', state)
    
    const results = await query.find();
    setCustomers(results.map(result => result.toJSON()));
  }

  const getAsaderas = async (oven = 1) => {
    const asaderas = await getAsaderasByOven(oven);
    setAsaderas(asaderas);
    setIsLoading(false);
  }

  const getAsaderasb4a = async (oven = 0) => {
    const query = new Parse.Query('asaderas');
    query.equalTo('oven', oven);

    const results = await query.find();
    setAsaderas(results.map(result => result.toJSON()));
    setIsLoading(false);
  }

  const getCustomerFullName = (customer_id) => {
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].objectId === customer_id) 
        return customers[i].full_name.toUpperCase();
    }
    return '';
  }

  useEffect(() => {
    getCustomersByStateb4a();
    getAsaderasb4a(props.oven);
    const focusHandler = props.navigation.addListener('focus', async () => {
      await getCustomersByStateb4a();
      await getAsaderasb4a(props.oven);
    });
    return focusHandler;
  }, []);

  if (isLoading) {
    return <ActivityIndicator size='large' />
  }
  if (customers.length === 0 || asaderas.length === 0) {
    return <Empty />
  }
  else 
    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {
        asaderas.map(asadera => {
          const customer_full_name = getCustomerFullName(asadera.customer_id);
          if (customer_full_name != '') {
            return (
              <ListItem 
                key={asadera.objectId}
                bottomDivider
                linearGradientProps={{
                  colors: ['#2d2d2d', '#0f0f0f'],
                  start: [1, 0],
                  end: [0.2, 0],
                }}
                ViewComponent={ LinearGradient }
                onPress={() => props.navigation.navigate('customerDetails', {customer_id: asadera.customer_id})}
              >
                <ListItem.Content>
                  <ListItem.Title style={{color: '#fff'}}>{customer_full_name}</ListItem.Title>
                </ListItem.Content>
    
                <ListItem.Content>
                  <ListItem.Title style={{color: '#fff'}}>{asadera.content + ' (' + getTimeText(asadera.entry_time) + ')'}</ListItem.Title>
                  <ListItem.Subtitle style={{color: '#ccc'}}>{ asadera.description }</ListItem.Subtitle>
                </ListItem.Content>
                <View>
                  <Icon
                    name={icons[asadera.state]}
                    color={colors[asadera.state]}
                  />
                  <Text style={{fontSize: 10, color: '#ccc'}}>{states[asadera.state]}</Text>
                </View>
                
              </ListItem>
              );
          }
        })
        }
      </ScrollView>
    )
}

export default Asaderas;