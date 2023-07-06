import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import Parse from "parse/react-native.js";

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

    const getCustomersB4A = async () => {
      const query = new Parse.Query('clientes');
      query.equalTo('state', props.state);

      const results = await query.find();
      setCustomers(results.map(result => result.toJSON()));
      setIsLoading(false);
    }
    
    useEffect(() => {
        getCustomersB4A();
        const focusHandler = props.navigation.addListener('focus', async () => {
            await getCustomersB4A();
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
              key={customer.objectId}
              bottomDivider
              linearGradientProps={{
                colors: ['#2d2d2d', '#0f0f0f'],
                start: [1, 0],
                end: [0.2, 0],
              }}
              ViewComponent={ LinearGradient }
              onPress={() => props.navigation.navigate(customer.state === 0 ? 'customerDetails' : 'delivered', {customer_id: customer.objectId})}
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