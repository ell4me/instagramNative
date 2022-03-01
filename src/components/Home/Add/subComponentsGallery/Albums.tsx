import React, {memo} from 'react';
import {Text, StyleSheet, ScrollView, Dimensions} from "react-native";
import {BlurView} from 'expo-blur';
import {AllAlbums} from "../Add";
import {Album} from "./Album";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';


type Props = {
    albums: AllAlbums,
    setCurrentAlbum: (id: string, title: string) => void
    animAlbums: Animated.SharedValue<number>
    isProfile: boolean
};
const {height} = Dimensions.get('window')
export const Albums = memo(({albums: {recent, myAlbums, typeMedia}, setCurrentAlbum, animAlbums, isProfile}: Props) => {
    const insets = useSafeAreaInsets()
    const translate = useAnimatedStyle(() => ({
        transform: [{translateY: interpolate(animAlbums.value, [0, 1], [height, 0])}]
    }))
    const bg = !isProfile ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.8)'
    const color = !isProfile ? '#888' : 'rgba(255,255,255, .4)'
    return (
        <Animated.View style={[style.container, translate, {backgroundColor: bg}]}>
            <BlurView intensity={100} tint={!isProfile ? 'light' : 'dark'} style={[style.container, {backgroundColor: bg}]}>
                {recent?.length > 0 &&
                <ScrollView
                    contentContainerStyle={{paddingTop: 5, paddingHorizontal: 12, paddingBottom: insets.bottom}}>
                    {recent.map(album => <Album key={album.id}
                                                setCurrentAlbum={() => setCurrentAlbum(album.id, album.title)}
                                                album={album} isProfile={isProfile}/>)}
                    <Text style={[style.title, {color}]}>My albums</Text>
                    {myAlbums.map(album => <Album key={album.id}
                                                  setCurrentAlbum={() => setCurrentAlbum(album.id, album.title)}
                                                  album={album} isProfile={isProfile}/>)}
                    <Text style={[style.title, {color}]}>Types of media</Text>
                    {typeMedia.map(album => <Album key={album.id}
                                                   setCurrentAlbum={() => setCurrentAlbum(album.id, album.title)}
                                                   album={album} isProfile={isProfile}/>)}
                </ScrollView>
                }
            </BlurView>
        </Animated.View>
    );
});


const style = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    title: {
        textTransform: 'uppercase',
        fontSize: 15,
        fontFamily: 'SegoeUISemiBold',
        paddingBottom: 20,
        paddingTop: 8,
        lineHeight: 15
    }
})
