import React from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import {GalleryType} from "../Add";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {MediaTypeValue} from "expo-media-library";
import {formattedDuration} from "../../../../utils/formattedDuration";

type Props = {
    gallery: GalleryType[]
    image: string
    setMainMedia: (uri: string, type: MediaTypeValue, id: string, duration: string) => void
    hideVideo: boolean
};
const {width} = Dimensions.get('window')
const SIZE = (width / 4) - 1
export const Gallery = ({gallery, image, setMainMedia, hideVideo}: Props) => {
    const insets = useSafeAreaInsets()
    return (
        <ScrollView contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingBottom: insets.bottom
        }}>
            {gallery.map(({uri, duration, type, id}, i) => {
                if(!hideVideo && type === 'video') {
                    return null
                }
                let formatDuration = ''
                if (!!duration && hideVideo) {
                    formatDuration = formattedDuration(duration)
                }
                return uri ? (
                    <TouchableWithoutFeedback key={i} onPress={() => {
                        if(image !== uri) {
                            setMainMedia(uri, type, id, formatDuration)
                        }
                    }}>
                        <View style={{backgroundColor: image === uri ? '#fff' : 'transparent'}}>
                            <Image source={{uri}}
                                   style={{
                                       width: SIZE,
                                       height: SIZE,
                                       margin: .5,
                                       opacity: image === uri ? .5 : 1
                                   }}/>
                            {!!duration && <Text style={style.duration}>{formatDuration}</Text>}
                        </View>
                    </TouchableWithoutFeedback>
                ) : null;
            })}
        </ScrollView>
    );
};


const style = StyleSheet.create({
    duration: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'SegoeUI',
        position: "absolute",
        bottom: 5,
        right: 5
    },
})
