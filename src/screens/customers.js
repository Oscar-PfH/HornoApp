import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../database/firebase";

import Empty from './empty';

import { getTimeText } from "../js/time";

import { styles } from "../styles/customers";

const Customers = (props) => {
    const [customers, setCustomers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);

    const getCustomers = async () => {
      const qry = query(collection(db, 'clientes'), where('state', '==', props.state));
      const docSnap = await getDocs(qry);
      let customers = [];
      docSnap.forEach(async (doc) => {
        const {full_name, price, phone, arrival_time, state} = doc.data();
        customers.push({
            id: doc.id, full_name, price, phone, arrival_time, state
        });
      });
      setCustomers(customers);
      setIsLoading(false);
    }
    
    useEffect(() => {
        getCustomers();
        const focusHandler = props.navigation.addListener('focus', async () => {
            await getCustomers();
        });
        return focusHandler;
    }, [props.navigation]);

    if (isLoading) {
      return <ActivityIndicator size='large' />
    }
    if (customers.length === 0) {
      return <Empty />
    }
    else return (
      <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      {
        customers.length > 0 ? 
          customers.map(customer => (
            <ListItem 
              key={customer.id}
              bottomDivider
              linearGradientProps={{
                colors: ['#2d2d2d', '#0f0f0f'],
                start: [1, 0],
                end: [0.2, 0],
              }}
              ViewComponent={ LinearGradient }
              onPress={() => props.navigation.navigate(customer.state === 0 ? 'customerDetails' : 'delivered', {customer_id: customer.id})}
              >
              <ListItem.Content>
                <ListItem.Title style={{color: '#fff'}}>{customer.full_name.toUpperCase() + ' (' + getTimeText(customer.arrival_time) + ')'} </ListItem.Title>
                <ListItem.Subtitle style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                  <View>
                    <Text style={{color: '#ccc'}}>{'S/' + customer.price + '.00                    '}</Text>
                  </View>
                  {
                  customer.phone > 0 &&
                  <View style={styles.phoneView}>
                    <Icon
                      name='phone'
                      color={'#ccc'}
                      containerStyle={styles.phoneIconContainer}
                      iconStyle={styles.phoneIcon}
                    />
                    <Text style={{color: '#ccc'}}>
                      {customer.phone}
                    </Text>
                  </View>
                  }
                </ListItem.Subtitle>
              </ListItem.Content>
    
              <ListItem.Chevron />
            </ListItem>
          ))
        : <Empty />
      }
      
      </ScrollView>
    )
}

export default Customers;