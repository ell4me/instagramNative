import React, {useEffect, useState} from 'react';
import {Image, View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback} from "react-native";
import {useSelector} from "react-redux";
import {getUserInfo} from "../../../../redux/selectors/user-selectors";
import {PostType} from "../../../../redux/reducers/user-reducer";
import {formatDistance, fromUnixTime} from 'date-fns'
import {BorderlessButton} from "react-native-gesture-handler";
import {Feather as Icon} from "@expo/vector-icons";
import Svg, {Path} from "react-native-svg";
import * as Haptics from 'expo-haptics';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import {actionsAPI} from "../../../../api";


type Props = {
    post: PostType
    navigateToProfile: (id: string) => void
    currentUserId: string
};
const {width, height} = Dimensions.get('window')
export const Post = ({
                         post: {id, comments, dateCreated, likes, media, caption},
                         navigateToProfile,
                         currentUserId
                     }: Props) => {
    const {username, photo, id: userId} = useSelector(getUserInfo)
    const [stateLike, setStateLike] = useState(likes.includes(userId))
    const [likesCount, setLikesCount] = useState(likes.length)
    const [doubleTap, setDoubleTap] = useState(0)
    const animMiniHeart = useSharedValue(1)
    const animLargeHeart = useSharedValue(0)
    const animLargeHeartOpacity = useSharedValue(0)
    const likeHandler = async (large: boolean) => {
        if (!stateLike || large) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        animMiniHeart.value = withSequence(
            withTiming(.9, {duration: 100}),
            withTiming(1.1, {duration: 100}),
            withTiming(1, {duration: 100})
        )
        if(large && !animLargeHeartOpacity.value) {
            animLargeHeartOpacity.value = withTiming(1, {duration: 100})
            animLargeHeart.value = withSequence(
                withTiming(.2, {duration: 200}),
                withTiming(.16, {duration: 200}),
                withTiming(.165, {duration: 200})
            )
            setTimeout(() => {
                animLargeHeartOpacity.value = withTiming(0)
                animLargeHeart.value = withTiming(0)
            }, 1000)
            setStateLike(true)
        } else if(!large) {
            setStateLike(c => !c)
        }
        if((large && !stateLike) || !large) {
            setLikesCount(c => stateLike ? c - 1 : c + 1)
            await actionsAPI.toggleLike(stateLike, userId, id)
        }
    }
    const styleMiniHeart = useAnimatedStyle(() => ({
        transform: [{scale: animMiniHeart.value}]
    }))
    const styleLargeHeart = useAnimatedStyle(() => ({
        transform: [{scale: animLargeHeart.value}],
        opacity: animLargeHeartOpacity.value
    }))
    return (
        <View>
            <View style={[styles.flexRow, styles.containerHeaderPost]}>
                <View style={styles.flexRow}>
                    <BorderlessButton style={styles.flexRow} onPress={() => navigateToProfile(currentUserId)}>
                        <View style={[styles.ava, {marginRight: 10}]}>
                            <Image style={styles.avaInner}
                                   source={photo ? {uri: photo} : require('../../../../../assets/defaultAva.png')}
                                   resizeMode={'cover'}/>
                        </View>
                        <Text style={styles.textBold}>{username}</Text>
                    </BorderlessButton>
                </View>
                {currentUserId === userId &&
                <BorderlessButton>
                    <Text style={[styles.textBold, {color: '#EE2D3E'}]}>Delete</Text>
                </BorderlessButton>
                }
            </View>
            <TouchableWithoutFeedback onPress={(e) => {
                if((Date.now() - doubleTap) < 250) {
                    likeHandler(true)
                }
                setDoubleTap(Date.now())
            }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={styles.mainImage}
                           source={{uri: media.src}}
                           resizeMode={'cover'}/>
                    <Animated.View style={[styleLargeHeart, {position: 'absolute'}]}>
                        <Image source={require('../../../../../assets/whiteHeart.png')}/>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
            <View style={{paddingHorizontal: 20}}>
                <View style={[styles.flexRow, {justifyContent: 'flex-start', paddingVertical: 10}]}>
                    <BorderlessButton onPress={() => likeHandler(false)}>
                        <Animated.View style={styleMiniHeart}>
                            <Svg
                                width={24}
                                height={24}
                                fill={stateLike ? '#FF3350' : 'none'}
                                strokeWidth={2}
                                stroke={stateLike ? '#FF3350' : '#000'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{marginRight: 10}}
                            >
                                <Path
                                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                            </Svg>
                        </Animated.View>
                    </BorderlessButton>
                    <BorderlessButton style={{transform: [{rotate: '-90deg'}]}}>
                        <Icon name={'message-circle'} size={25}/>
                    </BorderlessButton>
                </View>
                {!!likesCount && <Text style={[styles.textBold, {marginBottom: 5}]}>Likes: {likesCount}</Text>}
                {!!caption &&
                <View style={[styles.flexRow, {justifyContent: 'flex-start', alignItems: 'flex-end'}]}>
                    <BorderlessButton onPress={() => navigateToProfile(currentUserId)}>
                        <Text style={[styles.textBold, {marginRight: 5}]}>{username}</Text>
                    </BorderlessButton>
                    <TouchableWithoutFeedback style={{flex: 1}}>
                        <Text style={{lineHeight: 15}}>{caption}</Text>
                    </TouchableWithoutFeedback>
                </View>
                }
                {!!comments.length &&
                <>
                    <BorderlessButton>
                        <Text style={{color: '#918e8e', marginBottom: 3, marginTop: 5, fontSize: 15}}>Show all comments
                            ({comments.length})</Text>
                    </BorderlessButton>
                    {comments.slice(0, 2).map(comment => {
                        return (
                            <View style={[styles.flexRow, {
                                justifyContent: 'flex-start',
                                alignItems: 'flex-end',
                                marginBottom: 3
                            }]}>
                                <BorderlessButton onPress={() => navigateToProfile(comment.userId)}>
                                    <Text style={[styles.textBold, {marginRight: 5}]}>{comment.displayName}</Text>
                                </BorderlessButton>
                                <TouchableWithoutFeedback>
                                    <View style={{flex: 1}}>
                                        <Text style={{lineHeight: 15}}>{comment.text}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        )
                    })}
                </>
                }
                <Text style={{
                    color: '#918e8e',
                    marginTop: 5,
                    fontSize: 13
                }}>{formatDistance(fromUnixTime(dateCreated), new Date(), {addSuffix: true})}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ava: {
        width: 32,
        height: 32
    },
    textBold: {
        fontFamily: 'SegoeUISemiBold',
        fontSize: 15
    },
    text: {
        fontFamily: 'SegoeUIBold'
    },
    mainImage: {
        width,
        height: height / 2.15
    },
    containerHeaderPost: {
        borderColor: '#dadada',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avaInner: {
        flex: 1,
        width: 32,
        height: 32,
        borderRadius: 16,
    }
})
