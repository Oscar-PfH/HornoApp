import React, { useState} from "react";
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import Customers from "./customers";
import Asaderas from './asaderas';

import { styles } from '../styles/customers';

const Items = ({navigation}) => {
    const [filter, setFilter] = useState(0);
    const [text, setText] = useState('ready to show');
    const [gestureName, setGestureName] = useState('none');

    const onSwipeUp = (gestureState) => {
      //setText('You swiped up!');
    }
   
    const onSwipeDown = (gestureState) => {
      //setText('You swiped down!');
    }
   
    const onSwipeLeft = (gestureState) => {
      //setText('You swiped left!');
    }
   
    const onSwipeRight = (gestureState) => {
      //setText('You swiped right!');
    }

    const onSwipe = (gestureName, gestureState) => {
      const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
      setGestureName(gestureName);
      switch (gestureName) {
        case SWIPE_UP:
          break;
        case SWIPE_DOWN:
          break;
        case SWIPE_LEFT:
          setFilter(filter + 1 > 3 ? 3 : filter + 1);
          break;
        case SWIPE_RIGHT:
          setFilter(filter - 1 < 0 ? 0 : filter - 1);
          break;
      }
    }

    const Filter = () => (
      <View style={styles.filter}>
        <SelectDropdown
          data={['Clientes', 'Horno 1', 'Horno 2', 'Entregados']}
          defaultValueByIndex={filter}
          onSelect={(selectedItem, index) => {
            setFilter(index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem
          }}
          rowTextForSelection={(item, index) => {
            return item
          }}
          buttonStyle={styles.filterBtn}
          buttonTextStyle={styles.filterBtnText}
          renderDropdownIcon={isOpened => {
            return <Icon name={isOpened ? 'expand-less' : 'expand-more'} color={'#a4a4a4'} size={18} />;
          }}
          dropdownIconPosition={'right'}
        />
      </View>
    );

    return (
      <View style={{ flex: 1 , zIndex: -5}}>
        <Filter />
        <GestureRecognizer
          onSwipe={(direction, state) => onSwipe(direction, state)}
          onSwipeUp={(state) => onSwipeUp(state)}
          onSwipeDown={(state) => onSwipeDown(state)}
          onSwipeLeft={(state) => onSwipeLeft(state)}
          onSwipeRight={(state) => onSwipeRight(state)}
          config={{
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
          }}
          style={{
            flex: 1
          }}
        >
          {
            filter === 0 && 
            <Customers state={0} navigation={navigation} />
          }
          {
            filter === 1 &&
            <Asaderas oven={0} navigation={navigation}/>
          }
          {
            filter === 2 &&
            <Asaderas oven={1} navigation={navigation} />
          }
          {
            filter === 3 &&
            <Customers state={1} navigation={navigation} />
          }
        </GestureRecognizer>
        
        
        <Icon
          name='add'
          color='#ff8f00'
          containerStyle={styles.addButton}
          iconStyle={styles.addIcon}
          onPress={() => navigation.navigate('addCustomer')}
        />
      </View>
    )
}

export default Items;