import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {MainStackParams} from "../../Navigation";
import {Album, MediaTypeValue} from "expo-media-library";
import Animated, {Easing, interpolate, useAnimatedStyle} from "react-native-reanimated";
import {useTiming} from "react-native-redash";
import {CameraContainer} from "./subComponentsGallery/CameraContainer";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GalleryContainer} from "./GalleryContainer";


type keys = 'recent' | 'myAlbums' | 'typeMedia'
export type AllAlbums = { [key in keys]: Album[] }
export type GalleryType = {
    uri: string,
    duration: number
    type: MediaTypeValue
    id: string
}
export type MediaType = { uri: string, type: MediaTypeValue, id: string, duration?: string }
export const Add = ({navigation}: StackScreenProps<MainStackParams>) => {
    const insets = useSafeAreaInsets()
    const [image, setImage] = useState<MediaType>({uri: ''} as MediaType);
    const [camera, setCamera] = useState(false)
    const animCamera = useTiming(camera)
    const cameraOpacity = useAnimatedStyle(() => ({
        opacity: animCamera.value,
        flex: animCamera.value
    }))
    const goToPublishPost = () => navigation.navigate('PublishPost', {...image})
    return (
        <View style={style.container}>
            <Animated.View style={[style.containerCamera, cameraOpacity, {paddingBottom: insets.bottom}]}>
                <CameraContainer cameraClose={() => setCamera(false)}
                                 goNext={(uri) => navigation.navigate('ConfirmPic', {uri, type: 'photo'})}
                                 goBack={() => navigation.goBack()} image={image.uri}/>
            </Animated.View>
            <GalleryContainer anim={animCamera} image={image} goTo={goToPublishPost}
                              goBack={() => navigation.navigate('Home')}
                              setCamera={() => setCamera(true)} setImage={setImage}/>
        </View>
    );
};


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    containerCamera: {
        backgroundColor: '#000',
        ...StyleSheet.absoluteFillObject
    }
})
