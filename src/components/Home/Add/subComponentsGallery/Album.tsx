import React from 'react';
import {StyleSheet, View, Image, Text} from "react-native";
import {Album as AlbumType} from "expo-media-library";
import {BorderlessButton} from "react-native-gesture-handler";


type Props = {
    album: AlbumType & { thumb?: string }
    setCurrentAlbum: () => void
    isProfile: boolean
};
export const Album = ({album, setCurrentAlbum, isProfile}: Props) => {
    const color = !isProfile ? '#000' : '#fff'
    return (
        <BorderlessButton style={style.container} onPress={setCurrentAlbum}>
            <Image source={{uri: album.thumb}} style={style.image}/>
            <View>
                <Text style={[style.text, {color}]}>{album.title}</Text>
                <Text style={[style.text, {fontSize: 13, color}]}>{album.assetCount}</Text>
            </View>
        </BorderlessButton>
    );
};


const style = StyleSheet.create({
    container: {
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 12
    },
    text: {
        fontFamily: 'SegoeUI',
        fontSize: 17
    }
})
