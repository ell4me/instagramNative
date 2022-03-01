import React, {FC, useCallback, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    LayoutChangeEvent
} from "react-native";
import {MediaTypeValue} from "expo-media-library";
import {Video} from "expo-av";
import {CoordinatesType} from "./Profile";

type Props = {
    media: { src: string, type: MediaTypeValue, duration?: string }
    openListPosts: (coordinates: CoordinatesType) => void
    headerHeight: number
};
const {width, height} = Dimensions.get('window')
const SIZE = (width / 3) - 1
export const PostsList: FC<Props> = ({media: {src, type, duration}, openListPosts, headerHeight}) => {
    const [load, setLoad] = useState(true)
    const [coordinates, setCoordinates] = useState({x: 0, y: 0})
    const onLayout = useCallback(
        ({nativeEvent}: LayoutChangeEvent) => {
                let x = nativeEvent.layout.x
                let y = nativeEvent.layout.y
                if(x === 0.5) {
                    x = 1
                }
                if(y === 0.5) {
                    y = headerHeight
                } else {
                    y += headerHeight
                }
                setCoordinates({x, y})
        }, [headerHeight]);
    return (
        <TouchableWithoutFeedback disabled={load} onPress={() => openListPosts(coordinates)}
                                  onLayout={onLayout}>
            <View style={styles.post}>
                {load && <ActivityIndicator style={{...StyleSheet.absoluteFillObject}} size={'small'} color={'#000'}/>}
                {type === 'photo' ?
                    <Image source={{uri: src}} style={{flex: 1}} onLoad={() => setLoad(false)}/>
                    : <View>
                        <Video
                            style={styles.post}
                            source={{uri: src}}
                            resizeMode="cover"
                            useNativeControls={false}
                            onLoad={() => setLoad(false)}
                            usePoster
                        />
                        <Text style={styles.duration}>{duration}</Text>
                    </View>
                }
            </View>
        </TouchableWithoutFeedback>
    );
};


const styles = StyleSheet.create({
    post: {
        width: SIZE,
        height: SIZE,
        margin: .5,
    },
    duration: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'SegoeUI',
        position: "absolute",
        bottom: 5,
        right: 5
    }
})
