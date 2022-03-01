import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    TouchableWithoutFeedback,
    Platform
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {MainStackParams} from "../../Navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {BorderlessButton} from "react-native-gesture-handler";
import {Feather as Icon} from "@expo/vector-icons";
import {useIsFocused} from "@react-navigation/native";
import Animated, {interpolate, useAnimatedStyle} from "react-native-reanimated";
import {useTiming} from "react-native-redash";
import {useDispatch, useSelector} from "react-redux";
import {publishPost} from "../../../redux/reducers/actionsUser-reducer";
import {getUserInfo} from "../../../redux/selectors/user-selectors";
import {getPublishStatus} from "../../../redux/selectors/actionsUser-selectors";
import * as MediaLibrary from "expo-media-library";
import {StatusBar} from "expo-status-bar";


const {width} = Dimensions.get('window')
export const PublishPost = ({navigation, route}: StackScreenProps<MainStackParams, 'PublishPost'>) => {
    const dispatch = useDispatch()
    const {id} = useSelector(getUserInfo)
    const isLoading = useSelector(getPublishStatus)
    const insets = useSafeAreaInsets()
    const focused = useIsFocused()
    const ref = useRef<TextInput>(null)
    const [focus, setFocus] = useState(false)
    const [localUri, setLocalUri] = useState('')
    const [text, setText] = useState('')
    const animOverlay = useTiming(focus)
    const animTitle = useTiming(focused, {duration: 500})

    const blurHandler = () => {
        setFocus(false)
        ref.current?.blur()
    }
    const opacity = useAnimatedStyle(() => ({
        opacity: animOverlay.value
    }))
    const translate = useAnimatedStyle(() => ({
        transform: [{translateX: interpolate(animTitle.value, [0, 1], [width / 2, 0])}]
    }))
    const publish = () => {
        if (route.params) {
            dispatch(publishPost({
                id, caption: text,
                media: {src: route.params.type === 'photo' ? route.params.uri : localUri,
                    type: route.params.type, duration: route.params.duration},
                cb: () => navigation.navigate('Home')
            }))
        }
    }

    useEffect(() => {
        if (route.params?.type === 'video') {
            (async () => {
                if (route.params && route.params.id) {
                    const {localUri} = await MediaLibrary.getAssetInfoAsync(route.params.id)
                    if (localUri) {
                        setLocalUri(Platform.OS === "android" ? localUri.replace('file://', '') : localUri)
                    }
                }
            })()
        }
    }, [route.params])
    return (
        <View style={{flex: 1}}>
            <StatusBar style={'dark'}/>
            <View style={[{paddingTop: insets.top, height: 90}, style.headerContainer]}>
                {focus ? <View style={{width: 1}}/> :
                    <BorderlessButton onPress={() => navigation.goBack()}>
                        <Icon name={'chevron-left'} color={"#111"} size={34}/>
                    </BorderlessButton>
                }
                <Animated.Text style={[style.titleHeader, translate]}>{focus ? 'Caption' : 'New post'}</Animated.Text>
                <BorderlessButton onPress={focus ? blurHandler : publish}>
                    <Text style={[style.button, {fontSize: 18}]}>{focus ? 'OK' : 'Publish'}</Text>
                </BorderlessButton>
            </View>
            <View style={style.inputContainer}>
                <Image source={{uri: route.params?.uri}} style={{width: 80, height: 80}}/>
                <TextInput ref={ref} value={text} onChangeText={setText} onFocus={() => setFocus(true)}
                           style={{fontSize: 16, marginLeft: 10, flex: 1, height: 80}}
                           placeholder={'Add a caption...'}
                           placeholderTextColor={'#918e8e'}
                           multiline={true} underlineColorAndroid='transparent' keyboardType={'twitter'}/>
            </View>
            <TouchableWithoutFeedback onPress={blurHandler}>
                <Animated.View style={[{flex: 1, backgroundColor: 'rgba(0,0,0, .5)'}, opacity]}/>
            </TouchableWithoutFeedback>
            {isLoading &&
            <View style={style.containerProgress}>
                <Image style={{marginBottom: 10}} source={require('../../../../assets/preloader.gif')}/>
                <Text style={style.titleHeader}>Publish in progress...</Text>
            </View>
            }
        </View>
    );
};

const style = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        padding: 20,
        alignItems: "flex-start"
    },
    containerProgress: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    button: {
        fontFamily: 'SegoeUISemiBold',
        fontSize: 15,
        color: '#0095f6',
    },
    titleHeader: {
        fontFamily: 'SegoeUIBold',
        fontSize: 18,
        color: '#111',
        paddingLeft: 25
    },
    headerContainer: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0,0,0, .5)',
        paddingBottom: 10
    }
})
