import React, {useRef} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from "react-native";
import {BorderlessButton} from "react-native-gesture-handler";
import {Ionicons as Icon} from "@expo/vector-icons";
import {Video} from "expo-av";
import {MediaType} from "../Add";

type Props = {
    onLoad: () => void,
    image: MediaType,
    currentAlbumTitle: string
    openAlbumsHandler: () => void
    openCamera?: () => void
};
const {width, height} = Dimensions.get('window')
export const TopImageWithButtons = ({
                                        onLoad,
                                        image: {uri, type},
                                        currentAlbumTitle,
                                        openAlbumsHandler,
                                        openCamera
                                    }: Props) => {
    const video = useRef<Video>(null);
    return (
        <>
            {type === 'photo' ?
                <View>
                    <Image source={{uri}} style={style.sizes}
                           onLoad={onLoad}/>
                </View> :
                <View>
                    <Video
                        ref={video}
                        style={style.sizes}
                        source={{uri}}
                        resizeMode="cover"
                        isLooping
                        useNativeControls={false}
                        onLoad={onLoad}
                        shouldPlay
                    />
                </View>
            }
            <View style={style.additionalButtons}>
                <BorderlessButton onPress={openAlbumsHandler} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        color: '#fff',
                        fontFamily: 'SegoeUIBold',
                        fontSize: 18,
                        lineHeight: 18
                    }}>{currentAlbumTitle} </Text>
                    <Icon name={'chevron-down'} color={'#fff'} size={16}/>
                </BorderlessButton>
                {!!openCamera ?
                    <BorderlessButton onPress={openCamera}>
                        <View style={style.cameraButton}>
                            <Icon name={'camera-outline'} color={'#fff'} size={16}/>
                        </View>
                    </BorderlessButton>
                 : <View style={{width: 32, height: 32}}/>
                }
            </View>
        </>
    );
};

const style = StyleSheet.create({
    cameraButton: {
        width: 32,
        height: 32,
        borderRadius: 50,
        backgroundColor: '#1c1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,.1)',
    },
    additionalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    sizes: {
        width: width,
        height: height / 2.1
    },
    overlay: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(136,136,136,.7)',
        alignItems: 'center',
        justifyContent: 'center'
    }
})


