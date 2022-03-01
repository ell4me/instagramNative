import React, {useEffect} from 'react';
import {Provider} from "react-redux";
import {store} from "./src/redux/store";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Navigation} from "./src/components/Navigation";
import * as SplashScreen from 'expo-splash-screen';

const fonts = {
    'SegoeUI': require('./assets/fonts/SegoeUI.ttf'),
    'SegoeUIBold': require('./assets/fonts/SegoeUI-Bold.ttf'),
    'SegoeUISemiBold': require('./assets/fonts/SegoeUI-SemiBold.ttf')
}
const assets = [require('./assets/splash.png'), require('./assets/logo.png')]

export default function App() {
    useEffect(() => {
        (async () => {
            await SplashScreen.preventAutoHideAsync();
        })()
    }, [])
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <Navigation fonts={fonts} assets={assets}/>
            </Provider>
        </SafeAreaProvider>
    );
}



