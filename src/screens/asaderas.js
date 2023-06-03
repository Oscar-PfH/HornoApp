import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { ListItem, Avatar, Button, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import { collection, doc, getDocs, query, where } from "firebase/firestore";
import db from "../../database/firebase";

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

  const getCustomers = async () => {
    const qry = query(collection(db, 'clientes'), where('state', '==', 0));
    const docSnap = await getDocs(qry);
    const customers = [];
    docSnap.forEach(async (doc) => {
      const {full_name, price, phone, arrival_time, state} = doc.data();
      customers.push({
          id: doc.id, full_name, price, phone, arrival_time, state
      });
    });
    setCustomers(customers);
  }

  const getAsaderas = async (oven = 1) => {
    const qry = query(collection(db, 'asaderas'), where('oven', '==', oven));
    const docSnap = await getDocs(qry);
    let asaderas = [];
    docSnap.forEach(doc => {
      const {customer_id, content, description, entry_time, state} = doc.data();
      asaderas.push({id: doc.id, customer_id, content, description, entry_time, state});
    });
    setAsaderas(asaderas);
    setIsLoading(false);
  }

  const getCustomerFullName = (customer_id) => {
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].id === customer_id) 
        return customers[i].full_name.toUpperCase();
    }
    return '';
  }

  useEffect(() => {
    getCustomers();
    getAsaderas(props.oven);
    const focusHandler = props.navigation.addListener('focus', async () => {
      await getCustomers();
      await getAsaderas(props.oven);
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
                key={asadera.id}
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