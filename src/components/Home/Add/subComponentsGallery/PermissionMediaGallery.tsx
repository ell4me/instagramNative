import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {BorderlessButton} from "react-native-gesture-handler";
import * as Linking from "expo-linking";

export const PermissionMediaGallery = () => {
    return (
        <View style={style.permission}>
            <Text style={{color: '#777777', fontFamily: 'SegoeUIBold', fontSize: 21, marginBottom: 10}}>Allow
                access to your photos</Text>
            <Text style={style.desc}>This will allow you to share photos from your library via Instagram and
                save them to your camera
                roll.</Text>
            <BorderlessButton onPress={() => Linking.openURL('app-settings:')}>
                <Text style={style.button}>Allow access to the library</Text>
            </BorderlessButton>
        </View>
    );
};

const style = StyleSheet.create({
    desc: {
        color: '#595959',
        fontFamily: 'SegoeUI',
        fontSize: 16,
        marginBottom: 35,
        textAlign: 'center'
    },
    permission: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
        paddingHorizontal: 15
    },
    button: {
        fontFamily: 'SegoeUI',
        fontSize: 15,
        color: '#0095f6'
    },
})
