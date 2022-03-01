import React from 'react';
import {StyleSheet, View, Text} from "react-native";
import {RectButton} from "react-native-gesture-handler";
import {useSelector} from "react-redux";
import {getUserInfo} from "../../../../redux/selectors/user-selectors";

type Props = {
    cancelChange: () => void
    openGallery: () => void
    openCamera: () => void
};
export const ChangePhoto = ({cancelChange, openGallery, openCamera}: Props) => {
    const {photo} = useSelector(getUserInfo)
    return (
        <>
            <View style={styles.containerBtns}>
                <View style={[styles.cancel, styles.button]}>
                    <Text style={[styles.text, styles.title]}>Change photo profile</Text>
                </View>
                {!!photo &&
                    <RectButton style={[styles.cancel, styles.button]}>
                        <Text style={styles.text}>Delete current photo</Text>
                    </RectButton>
                }
                <RectButton onPress={openCamera} style={[styles.cancel, styles.button]}>
                    <Text style={styles.text}>Take a photo</Text>
                </RectButton>
                <RectButton onPress={openGallery} style={[styles.cancel, styles.button]}>
                    <Text style={[styles.text]}>Choose from gallery</Text>
                </RectButton>
            </View>
            <RectButton onPress={cancelChange} style={styles.cancel}>
                <Text style={styles.text}>Cancel</Text>
            </RectButton>
        </>
    );
};


const styles = StyleSheet.create({
    title: {fontFamily: 'SegoeUISemiBold', fontSize: 15},
    button: {
        borderRadius: 0,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0,0,0, .1)',
        backgroundColor: 'transparent'
    },
    containerBtns: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 10
    },
    text: {
        fontFamily: 'SegoeUI',
        fontSize: 17,
        color: '#000'
    },
    cancel: {
        backgroundColor: '#fff',
        borderRadius: 15,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
