import React from 'react';
import {Alert, Image, StyleSheet, Text, View} from "react-native";
import {BorderlessButton, RectButton} from "react-native-gesture-handler";
import {Ionicons as Icon} from "@expo/vector-icons";
import {Meta} from "./Meta";
import {signOutUser} from "../../../../redux/reducers/user-reducer";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo} from "../../../../redux/selectors/user-selectors";

type Props = {
    editProfile: () => void
    setHeaderHeight: (height: number) => void
};
export const HeaderProfile = ({editProfile, setHeaderHeight}: Props) => {
    const insets = useSafeAreaInsets()
    const dispatch = useDispatch()
    const {username, fullName, aboutSelf, photo, posts, following, followers} = useSelector(getUserInfo)
    const createAlert = () =>
        Alert.alert(
            `Sign out of your account ${username}?`,
            "",
            [
                {
                    text: "Exit",
                    onPress: () => dispatch(signOutUser()),
                    style: "destructive"
                },
                { text: "Cancel" },
            ],
            { cancelable: false }
        );
    return (
        <View style={{paddingHorizontal: 20}} onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
            <View style={[styles.header, {paddingTop: insets.top}]}>
                <Text style={styles.usernameText}>{username}</Text>
                <BorderlessButton onPress={createAlert}>
                    <Icon name={'ios-exit-outline'} color={'#000'} size={27}/>
                </BorderlessButton>
            </View>
            <View style={styles.header}>
                <BorderlessButton style={styles.ava}>
                    <Image style={{flex: 1, width: 85, height: 85,  borderRadius: 80}}
                           source={photo ? {uri: photo} : require('../../../../../assets/defaultAva.png')}
                           resizeMode={'cover'}/>
                </BorderlessButton>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
                    <Meta name={'Posts'} count={!!posts ? posts.length : 0}/>
                    <Meta name={'Followers'} count={!!followers ? followers.length : 0}/>
                    <Meta name={'Following'} count={!!following ? following.length : 0}/>
                </View>
            </View>
            <View>
                <Text style={styles.regularSemiBoldText}>{fullName}</Text>
                {aboutSelf?.length > 0 && <Text style={styles.regularText}>{aboutSelf}</Text>}
            </View>
            <RectButton onPress={editProfile} style={styles.editButton}>
                <Text style={styles.regularSemiBoldText}>Edit profile</Text>
            </RectButton>
        </View>
    );
};

const styles = StyleSheet.create({
    editButton: {
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 5,
        marginVertical: 20,
        borderColor: '#dadada',
        alignItems: 'center',
        justifyContent: 'center'
    },
    regularText: {
        fontFamily: 'SegoeUI',
        fontSize: 14,
        color: '#000'
    },
    regularSemiBoldText: {
        fontFamily: 'SegoeUISemiBold',
        fontSize: 15,
        color: '#000'
    },
    ava: {
        width: 85,
        height: 85,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 15
    },
    usernameText: {
        fontFamily: 'SegoeUIBold',
        color: '#000',
        fontSize: 25
    }
})
