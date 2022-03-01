import React from 'react';
import {BorderlessButton, RectButton} from "react-native-gesture-handler";
import {Feather as Icon} from "@expo/vector-icons";
import {StyleSheet, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type Props = {
    permissionLibrary: boolean
    closeHandler: () => void
    closeAlbumsHandler: () => void
    goToPublishPost: () => void
    showAllAlbums: boolean
    ava: boolean
};
export const AddHeader = ({
                              permissionLibrary,
                              closeHandler,
                              closeAlbumsHandler,
                              showAllAlbums,
                              goToPublishPost,
                              ava
                          }: Props) => {
    const insets = useSafeAreaInsets()
    return (
        <View style={[{
            paddingTop: !ava ? 0 : insets.top,
            height: !ava ? 50 : 90,
            paddingBottom: !ava ? 0 : 10,
            backgroundColor: !ava ? '#fff' : '#000',
        }, style.headerContainer]}>
            <BorderlessButton onPress={showAllAlbums ? closeAlbumsHandler : closeHandler}>
                {showAllAlbums || !ava ? <Text style={[style.cancel, {color: !ava ? '#000' : '#fff'}]}>Cancel</Text> :
                    <Icon name={'x'} color={"#fff"} size={34}/>}
            </BorderlessButton>
            {permissionLibrary &&
            <Text
                style={[style.titleHeader, {color: !ava ? '#000' : '#fff'}]}>{showAllAlbums ? 'Choose album' : !ava ? 'Choose photo' : 'New post'}</Text>}
            {permissionLibrary && (showAllAlbums
                    ? <View style={{width: 50}}/>
                    : <BorderlessButton onPress={goToPublishPost}>
                        <Text style={[style.button, {fontSize: 18}]}>{!ava ? 'Ready' : 'Next'}</Text>
                    </BorderlessButton>
            )}
        </View>
    );
};

const style = StyleSheet.create({
    button: {
        fontFamily: 'SegoeUI',
        fontSize: 15,
        color: '#0095f6'
    },
    titleHeader: {
        fontFamily: 'SegoeUIBold',
        fontSize: 18,
    },
    headerContainer: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255, .1)',
    },
    cancel: {
        fontFamily: 'SegoeUI',
        fontSize: 18
    }
})
