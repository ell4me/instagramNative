import React, {FC, useEffect, useState} from 'react';
import {Login, SignUp} from "./Registration";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {useCurrentUser} from "../hooks/useCurrentUser";
import {Add} from "./Home/Add/Add";
import {Dimensions, StyleSheet} from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import {FontSource, useLoadAssets} from "../hooks/useLoadAssets";
import {Welcome} from "./Registration/Welcome";
import AppLoading from "expo-app-loading";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {NavigatorTabs} from "./Home/Tabs/NavigatorTabs";
import {PublishPost} from "./Home/Add/PublishPost";
import {MediaTypeValue} from "expo-media-library";
import {ConfirmPic} from "./Home/Add/ConfirmPic";
import {EditProfile} from "./Home/Tabs/Profile/EditProfile";
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo} from "../redux/selectors/user-selectors";
import {Asset} from "expo-asset";
import {setCurrentUserInfo} from "../redux/reducers/user-reducer";
import {useListenerPosts} from "../hooks/useListenerPosts";

interface LoadAssetsProps {
    fonts?: FontSource;
    assets?: number[];
}

const {width, height} = Dimensions.get('window')


const AuthStack = createStackNavigator<AuthStackParams>()
const MainStack = createStackNavigator<MainStackParams>()

export const Navigation: FC<LoadAssetsProps> = ({assets, fonts}) => {
    const [hideImg, setHideImg] = useState(true)
    const dispatch = useDispatch()
    const anim = useSharedValue(1)
    const isAuth = useCurrentUser()
    const {photo, id} = useSelector(getUserInfo)
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(photo)
    const ready = useLoadAssets(assets || [], fonts || {});

    useListenerPosts(id)
    useEffect(() => {
        if(photo !== currentPhoto && !!photo) {
            (async () => {
                try {
                    const res = await Asset.loadAsync(photo)
                    setCurrentPhoto(res[0].localUri)
                    dispatch(setCurrentUserInfo({photo: res[0].localUri}))
                } catch (e) {
                    // do something
                }
            })()
        }
    }, [photo]);


    const onLoad = async () => {
        await SplashScreen.hideAsync();
        // do some stuff
        anim.value = withTiming(0, {duration: 300}, () => {
            runOnJS(setHideImg)(false)
        })
    }
    const style = useAnimatedStyle(() => ({
        opacity: anim.value
    }))

    if (isAuth === null || !ready) {
        return <AppLoading autoHideSplash={false}/>
    }
    return (
        <NavigationContainer>
            {!isAuth
                ? <AuthStack.Navigator screenOptions={{headerShown: false}}>
                    <AuthStack.Screen name={'Welcome'} component={Welcome}/>
                    <AuthStack.Screen name={'SignUp'} component={SignUp}/>
                    <AuthStack.Screen name={'Login'} component={Login}/>
                </AuthStack.Navigator>
                : <MainStack.Navigator screenOptions={{headerShown: false}}>
                    <MainStack.Screen name={'Home'} component={NavigatorTabs}/>
                    <MainStack.Screen name={'Add'} component={Add} options={{gestureDirection:  'horizontal-inverted'}}/>
                    <MainStack.Screen name={'PublishPost'} component={PublishPost} options={{gestureEnabled: false}}/>
                    <MainStack.Screen name={'ConfirmPic'} component={ConfirmPic} options={{gestureEnabled: false}}/>
                    <MainStack.Screen name={'EditProfile'} component={EditProfile}
                                      options={{presentation: 'modal', gestureEnabled: false}}/>
                </MainStack.Navigator>
            }
            {hideImg && <Animated.Image style={[style, {
                flex: 1,
                width,
                height,
                ...StyleSheet.absoluteFillObject
            }]} resizeMode={'contain'} source={require('../../assets/splash.png')} onLoad={onLoad}/>}
        </NavigationContainer>
    );
};

export type AuthStackParams = {
    Welcome: undefined
    SignUp: undefined
    Login: undefined
}
export type MainStackParams = {
    Home: undefined;
    Add: undefined
    PublishPost: { uri: string, type: MediaTypeValue, id?: string, duration?: string }
    ConfirmPic: { uri: string, type: MediaTypeValue}
    EditProfile: undefined
}

