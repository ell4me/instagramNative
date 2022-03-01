import React from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from "react-native";
import { Feather as Icon } from '@expo/vector-icons';


type Props = {
    touched?: boolean
    error?: string
} & TextInputProps;
export const Input = ({touched,error, ...restProps}: Props) => {
    const borderColor = touched && error ? '#EE2D3E' : touched && !error ? '#a8a8a8' : '#dbdbdb'
    const color = touched && error ? '#EE2D3E' : '#A6A8AB'
    return (
        <View style={[{borderColor}, style.container]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput selectionColor={'#a8a8a8'} style={style.input} underlineColorAndroid={'transparent'}
                       placeholderTextColor={'#AAAB9C'} {...restProps}/>
                {touched &&
                    <View style={[style.containerIcon, {borderColor: color}]}>
                        <Icon style={{paddingLeft: 1, paddingTop: 1}} name={error ? 'x' : 'check'} color={color} size={10}/>
                    </View>
                }
            </View>
        </View>
    );
};


const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        height: 36,
        justifyContent: 'space-between',
        marginBottom: 6
    },
    input: {
        color: '#262626',
        fontSize: 12,
        padding: 8,
        flex: 1
    },
    containerIcon:{
        width: 20,
        height: 20,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderWidth: StyleSheet.hairlineWidth
    }
})
