import React from 'react';
import {Ionicons as Icon} from "@expo/vector-icons";
import {StyleSheet, View} from "react-native";

export const IconPlus = ({bottom = -8, right = -8}: {bottom?: number, right?: number}) => {
    return (
        <View style={[style.add, {bottom, right}]}>
            <Icon name={'add'} style={style.icon} color={'#fff'} size={20}/>
        </View>
    );
};

const style = StyleSheet.create({
    add: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0095f6',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#fff',
        width: 25,
        height: 25
    },
    icon: {paddingTop: 1, paddingLeft: 1}
})
