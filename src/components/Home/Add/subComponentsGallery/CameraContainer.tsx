import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Image} from "react-native";
import {Camera} from "expo-camera";
import {BorderlessButton} from "react-native-gesture-handler";
import {Ionicons as Icon} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import {IconPlus} from "../../../IconPlus";


type Props = {
    image: string
    goBack: () => void
    cameraClose: () => void
    goNext: (uri: string) => void
};
export const CameraContainer = ({image, goBack, goNext, cameraClose}: Props) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const camera = useRef<Camera | null>()
    const insets = useSafeAreaInsets()
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [heightCamera, setHeightCamera] = useState(0)
    useEffect(() => {
        (async () => {
            const {status} = await Camera.getCameraPermissionsAsync()
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View/>;
    }
    const requestPermission = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync()
        if (status === 'denied') {
            await Linking.openURL('app-settings:')
        }
        setHasPermission(status === 'granted');
    }
    const flipCamera = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    }
    const takePicture = async () => {
        const response = await camera.current?.takePictureAsync({quality: 0.1})
        if (response) {
            goNext(response.uri)
        }
    }

    return (
        <>
            <View style={[{height: heightCamera / 3.5}, style.containerHeader]}>
                <BorderlessButton onPress={goBack}
                                  style={{top: insets.top * 1.3, right: 20, position: "absolute", zIndex: 11}}>
                    <Icon name={'close'} size={37} color={'#fff'}/>
                </BorderlessButton>
            </View>
            {hasPermission === false ?
                <View style={{alignItems: 'center', justifyContent: 'center', flex: .91}}>
                    <Text style={style.title}>Share via Instagram</Text>
                    <Text style={style.desc}>Allow access to take and share photos and videos.</Text>
                    <BorderlessButton onPress={requestPermission}>
                        <Text style={style.button}>Allow access to the camera</Text>
                    </BorderlessButton>
                </View>
                : <View style={{flex: .91, borderRadius: 20, overflow: 'hidden', marginTop: insets.top}}
                        onLayout={({nativeEvent}) =>
                            setHeightCamera(nativeEvent.layout.height)}>
                    <Camera style={[style.camera]} type={type} ref={ref => camera.current = ref}/>
                    <View style={[style.containerHeader, {
                        height: heightCamera / 4,
                        top: undefined,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}>
                        <BorderlessButton onPress={takePicture} style={style.takePicture}>
                            <View style={[style.takePicture, style.takePictureInner]}/>
                        </BorderlessButton>
                    </View>
                </View>
            }
            <View style={style.bottom}>
                <BorderlessButton onPress={cameraClose} style={style.imageContainer}>
                    {!!image && <Image source={{uri: image}} resizeMode={'cover'} style={style.image}/>}
                    <IconPlus />
                </BorderlessButton>
                <BorderlessButton onPress={flipCamera}>
                    <Icon name={'camera-reverse'} color={'#fff'} size={40}/>
                </BorderlessButton>
            </View>
        </>
    );
};
const style = StyleSheet.create({
    camera: {
        ...StyleSheet.absoluteFillObject
    },
    takePicture: {
        width: 80,
        height: 80,
        backgroundColor: '#fff', borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    takePictureInner: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 35
    },
    containerHeader: {
        backgroundColor: 'rgba(0,0,0,.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99
    },
    bottom: {
        flex: .09,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    imageContainer: {
        width: 40,
        height: 40,
    },
    image: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 10
    },
    desc: {
        color: '#7a7a7a',
        fontFamily: 'SegoeUI',
        fontSize: 16,
        marginBottom: 50,
        textAlign: 'center'
    },
    button: {
        fontFamily: 'SegoeUI',
        fontSize: 17,
        color: '#0095f6'
    },
    title: {
        color: '#fff',
        fontFamily: 'SegoeUIBold',
        fontSize: 21,
        marginBottom: 5,
        textAlign: 'center'
    }
})

