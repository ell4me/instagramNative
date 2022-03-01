import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View, Text} from "react-native";
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {BorderlessButton} from "react-native-gesture-handler";
import {Camera} from "expo-camera";
import * as Linking from "expo-linking";
import {Ionicons as Icon} from "@expo/vector-icons";

type Props = {
    anim: Animated.SharedValue<number>
    cancel: () => void
    takePhoto: (src: string) => void
};
const {height} = Dimensions.get('window')
export const TakePhoto = ({anim, cancel, takePhoto}: Props) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const camera = useRef<Camera | null>()
    const [type, setType] = useState(Camera.Constants.Type.back)


    useEffect(() => {
        (async () => {
            const {status} = await Camera.getCameraPermissionsAsync()
            setHasPermission(status === 'granted');
        })();
    }, []);

    const flipCamera = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    }
    const requestPermission = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync()
        if (status === 'denied') {
            await Linking.openURL('app-settings:')
        }
        setHasPermission(status === 'granted');
    }
    const takePicture = async () => {
        const response = await camera.current?.takePictureAsync({quality: 0.1})
        if (response) {
            takePhoto(response.uri)
            cancel()
        }
    }
    const translate = useAnimatedStyle(() => ({
        transform: [{translateY: interpolate(anim.value, [0, 1], [height, 0])}]
    }))


    if (hasPermission === null) {
        return <View/>;
    }
    return (
        <Animated.View style={[styles.container, translate]}>
            <View style={styles.headerContainer}>
                <BorderlessButton onPress={cancel}>
                    <Text style={styles.cancel}>Cancel</Text>
                </BorderlessButton>
                <Text style={styles.titleHeader}>Photo</Text>
                <View style={{width: 50}}/>
            </View>
            {hasPermission === false ?
                <View style={{alignItems: 'center', justifyContent: 'center', flex: .91}}>
                    <Text style={styles.desc}>Allow access to take a photo for your profile.</Text>
                    <BorderlessButton onPress={requestPermission}>
                        <Text style={styles.button}>Allow access to the camera</Text>
                    </BorderlessButton>
                </View>
                : <>
                    <View style={{flex: .5}}>
                        <Camera style={{...StyleSheet.absoluteFillObject}} type={type} ref={ref => camera.current = ref}/>
                        <BorderlessButton onPress={flipCamera} style={styles.flip}>
                            <Icon name={'camera-reverse'} color={'#fff'} size={30}/>
                        </BorderlessButton>
                    </View>
                    <View style={{flex: .5,  alignItems: 'center', justifyContent: 'center'}}>
                        <BorderlessButton onPress={takePicture} style={styles.takeButton}>
                            <View style={styles.innerTakeButton}/>
                        </BorderlessButton>
                    </View>
                </>
            }
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        ...StyleSheet.absoluteFillObject,
        paddingTop: 15
    },
    takeButton: {
        width: 80,
        height: 80,
        backgroundColor: '#c0bfbf',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerTakeButton: {
        backgroundColor: '#fff',
        width: 55,
        height: 55,
        borderRadius: 30
    },
    flip: {
      position: 'absolute',
      bottom: 15,
      left: 15
    },
    headerContainer: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0,0,0, .1)',
        paddingBottom: 15,
    },
    titleHeader: {
        fontFamily: 'SegoeUIBold',
        fontSize: 18,
    },
    cancel: {
        fontFamily: 'SegoeUI',
        fontSize: 18
    },
    desc: {
        color: '#000',
        fontFamily: 'SegoeUI',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center'
    },
    button: {
        fontFamily: 'SegoeUI',
        fontSize: 17,
        color: '#0095f6'
    }
})
