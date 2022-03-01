import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo} from "../../../../redux/selectors/user-selectors";
import {ScreenParamsPropsType} from "../../../../utils/NestedNavigatorType";
import {TabParams} from "../NavigatorTabs";
import {MainStackParams} from "../../../Navigation";
import {HeaderProfile} from "./HeaderProfile";
import {PostsList} from "./PostsList";
import {snapPoint, useTiming} from "react-native-redash";
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {BorderlessButton, PanGestureHandler, PanGestureHandlerGestureEvent} from "react-native-gesture-handler";
import {Feather as Icon} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Post} from "../Posts/Post";

const {width, height} = Dimensions.get('window')
export type CoordinatesType = { x: number, y: number }
type ShowAllPosts = CoordinatesType & { state: boolean }
const SIZE = (width / 3) - 1
export const Profile = ({navigation, route}: ScreenParamsPropsType<TabParams, MainStackParams, 'Profile'>) => {
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const {posts, username, id} = useSelector(getUserInfo)
    const [paramsId, setParamsId] = useState(route?.params?.id)
    const [isShowAllPosts, setIsShowAllPosts] = useState<ShowAllPosts>({state: false, x: 0, y: 0})
    const [headerHeight, setHeaderHeight] = useState(0)
    const animShowPosts = useTiming(isShowAllPosts.state, {duration: 300})
    const panX = useSharedValue(0)
    const panY = useSharedValue(0)
    const scale = useAnimatedStyle(() => ({
        width: interpolate(animShowPosts.value, [0, 1], [SIZE, width]),
        height: interpolate(animShowPosts.value, [0, 1], [SIZE, height]),
        top: interpolate(animShowPosts.value, [0, 1], [isShowAllPosts.y, 0]),
        left: interpolate(animShowPosts.value, [0, 1], [isShowAllPosts.x, 0]),
        zIndex: interpolate(animShowPosts.value, [0, 1], [-1, 1]),
        opacity: animShowPosts.value
    }), [isShowAllPosts])
    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            if(isShowAllPosts.state) {
                setIsShowAllPosts(c => ({...c, state: false}))
            }
            setParamsId(undefined)
        });
        return () => unsubscribe()
    }, [navigation, isShowAllPosts])
    useEffect(() => {
        if(route?.params?.id && route.params.id !== id) {
            setIsShowAllPosts(c => ({...c, state: false}))
            setParamsId(route.params.id)
            // check params user in array or do request
        }
    }, [route?.params?.id])

    const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { x: number, y: number }>({
        onStart: (e, ctx) => {
            ctx.x = panX.value
            ctx.y = panY.value
        },
        onActive: (e, ctx) => {
            panX.value = (ctx.x + e.translationX) * 0.45
            panY.value = (ctx.y + e.translationY) * 0.3
        },
        onEnd: ({translationX, translationY, velocityX, velocityY}) => {
            const snapPointX = snapPoint(translationX, velocityX, [-width / 1.5, 0, width / 1.5])
            const snapPointY = snapPoint(translationY, velocityY, [-height / 2, 0, height / 2])
            if (Math.abs(snapPointX) === width / 1.5 || Math.abs(snapPointY) === height / 2) {
                runOnJS(setIsShowAllPosts)({state: false, x: isShowAllPosts.x, y: isShowAllPosts.y})
                panX.value = withSpring(0, {overshootClamping: false, damping: 15})
                panY.value = withSpring(0, {overshootClamping: false, damping: 15})
            } else {
                panX.value = withSpring(snapPointX, {overshootClamping: false, damping: 15})
                panY.value = withSpring(snapPointY, {overshootClamping: false, damping: 15})
            }

        },
    }, [isShowAllPosts])

    const translation = useAnimatedStyle(() => ({
        transform: [{translateY: panY.value}, {translateX: panX.value},
            {scale: interpolate(panY.value + panX.value, [0, width / 2], [1, .9], Extrapolate.CLAMP)}]
    }))
    const overlayStyle = useAnimatedStyle(() => ({
        opacity: animShowPosts.value,
        zIndex: interpolate(animShowPosts.value, [0, 1], [-1, 1])
    }))
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.containerListPosts, overlayStyle, {
                backgroundColor: 'rgba(0,0,0,.5)',
                borderRadius: 0
            }]}/>
            <HeaderProfile editProfile={() => navigation.navigate('EditProfile')}
                           setHeaderHeight={(height: number) => setHeaderHeight(height)}/>
            <ScrollView contentContainerStyle={styles.containerPosts}>
                {!!posts && !!headerHeight && posts.map(post => {
                    return <PostsList headerHeight={headerHeight}
                                      openListPosts={(coordinates: CoordinatesType) => setIsShowAllPosts({state: true, ...coordinates})}
                                      key={post.id} media={post.media}/>
                })}
            </ScrollView>
            <PanGestureHandler {...{onGestureEvent}}>
                <Animated.View style={[styles.containerListPosts, scale, translation]}>
                    <View style={[{paddingTop: insets.top,}, styles.headerContainer]}>
                        <BorderlessButton onPress={() => setIsShowAllPosts(c => ({...c, state: false}))}>
                            <Icon name={'chevron-left'} color={"#000"} size={34}/>
                        </BorderlessButton>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[styles.usernameHeader]}>{username.toUpperCase()}</Text>
                            <Text style={[styles.titleHeader]}>Posts</Text>
                        </View>
                        <View style={{width: 25}}/>
                    </View>
                    <ScrollView scrollEventThrottle={16}>
                        {!!posts && posts.map(post => <Post currentUserId={!paramsId ? id : paramsId}
                                                            navigateToProfile={(id: string) => navigation.navigate('Profile', {id})}
                                                            key={post.id} post={post}/>)}
                    </ScrollView>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerPosts: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    containerListPosts: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        borderRadius: 50
    },
    usernameHeader: {
        fontFamily: 'SegoeUISemiBold',
        fontSize: 13,
        lineHeight: 13,
        color: '#676666'
    },
    titleHeader: {
        fontFamily: 'SegoeUIBold',
        fontSize: 18,
        lineHeight: 18,
        marginTop: 2
    },
    headerContainer: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0,0,0, .1)',
    }
})
