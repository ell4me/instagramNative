import * as React from 'react';
import Animated, {Easing, interpolate, useAnimatedStyle} from "react-native-reanimated";
import {StatusBar} from "expo-status-bar";
import {AddHeader} from "./subComponentsGallery/AddHeader";
import {PermissionMediaGallery} from "./subComponentsGallery/PermissionMediaGallery";
import {ActivityIndicator, Dimensions, Platform, StyleSheet, View} from "react-native";
import {TopImageWithButtons} from "./subComponentsGallery/TopImageWithButtons";
import {Gallery} from "./subComponentsGallery/Gallery";
import {Albums} from "./subComponentsGallery/Albums";
import {useIsFocused} from "@react-navigation/native";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useTiming} from "react-native-redash";
import {AllAlbums, GalleryType, MediaType} from "./Add";
import * as MediaLibrary from "expo-media-library";
import {Album, MediaTypeValue} from "expo-media-library";
import {formattedDuration} from "../../../utils/formattedDuration";

type Props = {
    setImage: Dispatch<SetStateAction<MediaType>>
    setCamera?: () => void
    goBack: () => void
    goTo: (() => void) | ((src: string) => void)
    image: MediaType
    anim: Animated.SharedValue<number>
};
const {width, height} = Dimensions.get('window')
export const GalleryContainer = ({anim, setImage, setCamera, goBack, goTo, image}: Props) => {
    const focused = useIsFocused()
    const [showAllAlbums, setShowAllAlbums] = useState(false)
    const [permissionLibrary, setPermissionLibrary] = useState(false);
    const [gallery, setGallery] = useState<GalleryType[]>([]);
    const [albums, setAlbums] = useState<AllAlbums>({} as AllAlbums);
    const [loading, setLoading] = useState(true);
    const animLoader = useTiming(loading)
    const [currentAlbum, setCurrentAlbum] = useState({id: '', title: 'Recents'})
    const animAlbums = useTiming(showAllAlbums, {duration: 200, easing: Easing.inOut(Easing.ease)})

    const getAssets = async (id: string) => {
        const {assets} = await MediaLibrary.getAssetsAsync({
            album: id,
            first: 10000,
            mediaType: ['photo', 'video']
        })
        return assets
    }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await MediaLibrary.requestPermissionsAsync();
                if (status === 'granted') {
                    setPermissionLibrary(true)
                }
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            const albums = await MediaLibrary.getAlbumsAsync({includeSmartAlbums: true});
            const recentlyAlbum = albums.filter(item => item.title === 'Recents')[0]
            const allRecentlyAssets = await getAssets(recentlyAlbum.id)
            let formatDuration = ''
            if(allRecentlyAssets[0].duration) {
                formatDuration = formattedDuration(allRecentlyAssets[0].duration)
            }
            setImage({uri: allRecentlyAssets[0].uri, type: allRecentlyAssets[0].mediaType,
                id: allRecentlyAssets[0].id, duration: formatDuration})
            setGallery(allRecentlyAssets.map(item => ({
                uri: item.uri,
                duration: item.duration,
                type: item.mediaType,
                id: item.id
            })))
            const allAlbums = {recent: [], myAlbums: [], typeMedia: []} as AllAlbums
            let item: Album & { thumb?: string }
            for (item of albums) {
                if (item.assetCount === 0 || (item.title === "Recently Added" || item.title === 'Recently Deleted')
                    || (setCamera === undefined && (item.title === 'Videos' || item.title === 'Slo-mo'))) {
                    continue
                } else {
                    const asset = await MediaLibrary.getAssetsAsync({
                        album: item.id,
                        first: 1,
                        mediaType: ['photo', 'video']
                    })
                    item.thumb = asset?.assets[0]?.uri
                    switch (item.type) {
                        case 'album':
                            allAlbums.myAlbums = [...allAlbums.myAlbums, item]
                            break
                        case 'smartAlbum':
                            if (item.title === 'Recents' || item.title === 'Favorites') {
                                allAlbums.recent = [...allAlbums.recent, item]
                            } else {
                                allAlbums.typeMedia = [...allAlbums.typeMedia, item]
                            }
                            break
                        default:
                            break
                    }
                }
            }
            setAlbums(allAlbums)
        })()
    }, []);
    const opacity = useAnimatedStyle(() => ({
        opacity: animLoader.value
    }))
    const handlerMainMedia = (uri: string, type: MediaTypeValue, id: string, duration: string) => {
        setLoading(true)
        setImage({uri, type, id, duration})
    }
    const handlerCurrentAlbum = (id: string, title: string) => {
        setShowAllAlbums(false)
        setCurrentAlbum({id, title})
    }
    useEffect(() => {
        if (currentAlbum?.id) {
            (async () => {
                const assets = await getAssets(currentAlbum.id)
                let formatDuration = ''
                if(assets[0].duration) {
                    formatDuration = formattedDuration(assets[0].duration)
                }
                setImage({uri: assets[0].uri, type: assets[0].mediaType, id: assets[0].id, duration: formatDuration})
                setGallery(assets.map(item => ({
                    uri: item.uri,
                    duration: item.duration,
                    type: item.mediaType,
                    id: item.id
                })))
            })()
        }
    }, [currentAlbum])
    const cameraTranslate = useAnimatedStyle(() => ({
        transform: [{
            translateY: !!setCamera ? interpolate(anim.value, [0, 1], [0, height]) :
                interpolate(anim.value, [0, 1], [height, 0])
        }]
    }))
    return (
        <Animated.View style={[{flex: 1}, cameraTranslate, !!setCamera ? {} : {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000'
        }]}>
            {focused && <StatusBar style={'light'}/>}
            <AddHeader ava={!!setCamera} goToPublishPost={() => goTo(image.uri)}
                       closeAlbumsHandler={() => setShowAllAlbums(false)}
                       showAllAlbums={showAllAlbums}
                       permissionLibrary={permissionLibrary} closeHandler={goBack}/>
            {!permissionLibrary
                ? <PermissionMediaGallery/>
                : <View style={{flex: 1}}>
                    {image.uri.length > 0 &&
                    <View style={{flex: 1}}>
                        <TopImageWithButtons openAlbumsHandler={() => setShowAllAlbums(true)}
                                             onLoad={() => setLoading(false)} image={image}
                                             currentAlbumTitle={currentAlbum.title}
                                             openCamera={setCamera}/>
                        <Gallery hideVideo={!!setCamera} gallery={gallery} image={image.uri} setMainMedia={handlerMainMedia}/>
                    </View>
                    }
                    <Animated.View style={[style.preloader, opacity]}>
                        <ActivityIndicator size="large" color="#fff"/>
                    </Animated.View>
                    <Albums isProfile={!!setCamera} animAlbums={animAlbums} albums={albums} setCurrentAlbum={handlerCurrentAlbum}/>
                </View>
            }
        </Animated.View>
    );
};


const style = StyleSheet.create({
    preloader: {
        width: width,
        height: height / 2.1,
        alignItems: 'center',
        justifyContent: 'center',
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0, .5)'
    }
})
