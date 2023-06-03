import React from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";

const Empty = (props) => {
    return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <Icon
            name={'cancel-presentation'}
            color={'#ccc'}
            containerStyle={{width: '50%'}}
            iconStyle={{fontSize: 100, textAlign: 'center'}}
            />
            <Text style={{fontSize: 30, color: '#ccc', textAlign: 'center'}}>Sin resultados</Text>
        </View>
    );
}

export default Empty;