import React from 'react';
import {StackScreenProps} from "@react-navigation/stack";
import {MainStackParams} from "../../Navigation";
import {StyleSheet, Text, View, Image, Dimensions} from "react-native";
import {StatusBar} from "expo-status-bar";
import {BorderlessButton} from "react-native-gesture-handler";
import {Feather as Icon} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const {width, height} = Dimensions.get("window")
export const ConfirmPic = ({navigation, route}: StackScreenProps<MainStackParams, 'ConfirmPic'>) => {
    const insets = useSafeAreaInsets()
    return (
        <View style={style.container}>
            <StatusBar style={'light'}/>
            <View style={[{paddingTop: insets.top, height: 90}, style.headerContainer]}>
                <BorderlessButton onPress={() => navigation.goBack()}>
                    <Icon name={'chevron-left'} color={"#fff"} size={34}/>
                </BorderlessButton>
                <BorderlessButton onPress={() => {
                    if(route.params) {
                        navigation.navigate('PublishPost', {uri: route.params.uri, type: 'photo'})
                    }
                }}>
                    <Text style={[style.button, {fontSize: 18}]}>Next</Text>
                </BorderlessButton>
            </View>
            <View style={{width, height: height / 2}}>
                {route.params && <Image source={{uri: route.params.uri}} resizeMode={'cover'} style={{flex: 1}}/>}
            </View>

        </View>
    );
};


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    button: {
        fontFamily: 'SegoeUI',
        fontSize: 15,
        color: '#0095f6'
    },
    headerContainer: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255, .1)',
        paddingBottom: 10
    }
})
