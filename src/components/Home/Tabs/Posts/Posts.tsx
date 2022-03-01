import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, ScrollView} from "react-native";
import {getUserInfo} from "../../../../redux/selectors/user-selectors";
import {useDispatch, useSelector} from "react-redux";
import {Feather as Icon} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {getAllUsers} from "../../../../redux/selectors/actionsUser-selectors";
import {getAllUsersInfo} from "../../../../redux/reducers/actionsUser-reducer";
import {CurrentUserInfo, PostType} from "../../../../redux/reducers/user-reducer";
import {Post} from "./Post";
import {ScreenParamsPropsType} from "../../../../utils/NestedNavigatorType";
import {TabParams} from "../NavigatorTabs";
import {MainStackParams} from "../../../Navigation";


type ExtendPostType = PostType & { userId: string }
export const Posts = ({navigation}: ScreenParamsPropsType<TabParams, MainStackParams, 'Posts'>) => {
    const currentUser = useSelector(getUserInfo)
    const [allFollowingUsers, setAllFollowingUsers] = useState<CurrentUserInfo[]>([])
    const [allPosts, setAllPosts] = useState<ExtendPostType[]>([])
    const allUsers = useSelector(getAllUsers)
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    useEffect(() => {
        if (!!currentUser && !!currentUser.following) {
            const filterIdsNotInAllUsers = currentUser.following.filter(item => !(!!allUsers.filter(user => user.id === item).length))
            if (!!filterIdsNotInAllUsers.length) {
                dispatch(getAllUsersInfo(filterIdsNotInAllUsers))
            } else {
                console.log(allUsers.filter(user => currentUser.following.includes(user.id)))
                setAllFollowingUsers([...allUsers.filter(user => currentUser.following.includes(user.id)), currentUser])
            }
        }
    }, [currentUser, allUsers]);
    useEffect(() => {
        if (!!allFollowingUsers) {
            let posts:ExtendPostType[] = []
            console.log(allFollowingUsers)
            allFollowingUsers.forEach(user => {
                posts.push(...user.posts.map(post => ({...post, userId: user.id})))
            })
            setAllPosts(posts.sort((a, b ) => b.dateCreated - a.dateCreated))
        }
    }, [allFollowingUsers]);

    return (
        <View style={styles.container}>
            <View style={[styles.headerContainer, {paddingTop: insets.top}]}>
                <Image source={require('../../../../../assets/logo.png')} style={styles.logo} resizeMode={'contain'}/>
                <Icon name={'send'} color={'#000'} size={25} style={{transform: [{rotate: '10deg'}]}}/>
            </View>
            <ScrollView style={styles.postsContainer} scrollEventThrottle={16}>
                {!!allPosts &&
                    allPosts.map(post => <Post key={post.id} post={post} currentUserId={post.userId} navigateToProfile={(id: string) => navigation.navigate('Profile', {id})}/>)
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    logo: {
        height: 45,
        width: 120
    },
    postsContainer: {},
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#dadada'
    }
})
