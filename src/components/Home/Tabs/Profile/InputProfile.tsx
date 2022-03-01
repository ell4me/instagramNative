import React, {useRef, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps, TouchableWithoutFeedback, View, Text} from "react-native";
import {Feather as Icon} from '@expo/vector-icons';
import {BorderlessButton} from "react-native-gesture-handler";


type Props = {
    clearVal: () => void
    border?: boolean
    label: string
    error?: string | undefined
} & TextInputProps
export const InputProfile = ({clearVal, border, label, error, ...props}: Props) => {
    const [isFocus, setIsFocus] = useState(false)
    const ref = useRef<TextInput>(null)
    return (
        <TouchableWithoutFeedback onPress={() => ref.current?.focus()}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{height: 45, justifyContent: 'center', flex: .25}}>
                    <Text style={{color: error ? '#EE2D3E' : '#262626', fontSize: 17, fontFamily: 'SegoeUI'}}>{label}</Text>
                </View>
                <View style={[style.container, {
                    flex: .75,
                    borderColor: error ? '#EE2D3E' : 'rgba(0,0,0,.1)',
                    borderBottomWidth: !border ? StyleSheet.hairlineWidth : 0
                }]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput autoCorrect={false} selectionColor={'#a8a8a8'} style={style.input}
                                   underlineColorAndroid={'transparent'}
                                   placeholderTextColor={'#AAAB9C'} {...props}
                                   onFocus={() => setIsFocus(true)}
                                   onBlur={() => setIsFocus(false)} ref={ref}/>
                        {isFocus && !!props.value &&
                        <BorderlessButton onPress={clearVal} style={[style.containerIcon]}>
                            <Icon style={{paddingLeft: 1, paddingTop: 1}} name={'x'} color={'#fff'} size={15}/>
                        </BorderlessButton>
                        }
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};


const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        minHeight: 45,
        justifyContent: 'space-between',
        marginBottom: 6
    },
    input: {
        color: '#262626',
        fontSize: 17,
        paddingRight: 15,
        paddingLeft: 5,
        flex: 1,
        fontFamily: 'SegoeUI'
    },
    containerIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#dadada',
    }
})
