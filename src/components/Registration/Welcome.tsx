import React from 'react';
import {ActivityIndicator, Dimensions, Image, StyleSheet, Text, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParams} from "../Navigation";
import {RectButton} from "react-native-gesture-handler";
import {CommonActions} from "@react-navigation/native";

const {width} = Dimensions.get('window')
export const Welcome = ({navigation}: StackScreenProps<AuthStackParams>) => {
    return (
        <View style={style.container}>
            <Image style={style.image} source={require('../../../assets/logo.png')}/>
            <RectButton style={style.button}
                        onPress={() => navigation.dispatch(CommonActions.reset({
                            index: 1,
                            routes: [{name: 'SignUp'}]
                        }))}>
                <Text style={{fontFamily: 'SegoeUISemiBold', fontSize: 15, color: '#fff'}}>Сreate a new account</Text>
            </RectButton>
            <RectButton onPress={() => navigation.dispatch(CommonActions.reset({
                            index: 1,
                            routes: [{name: 'Login'}]
                        }))}>
                <Text style={{fontFamily: 'SegoeUISemiBold', fontSize: 15, color: '#0095f6'}}>Sign In</Text>
            </RectButton>
        </View>
    );
};
const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 50
    },
    image: {
        marginBottom: 25
    },
    button: {
        backgroundColor: '#0095f6',
        alignItems: 'center',
        marginTop: 12,
        borderRadius: 5,
        paddingVertical: 12,
        marginBottom: 20,
        width: width - 100
    }
})
