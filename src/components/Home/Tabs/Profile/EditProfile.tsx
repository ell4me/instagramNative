import React, {useCallback, useEffect, useState} from 'react';
import {StackScreenProps} from "@react-navigation/stack";
import {MainStackParams} from "../../../Navigation";
import {Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View, Keyboard, Alert, ActivityIndicator} from "react-native";
import {BorderlessButton} from "react-native-gesture-handler";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useDispatch, useSelector} from "react-redux";
import {getUserInfo} from "../../../../redux/selectors/user-selectors";
import {InputProfile} from "./InputProfile";
import {useFormik} from "formik";
import * as Yup from "yup";
import {ChangePhoto} from "./ChangePhoto";
import Animated, {interpolate, useAnimatedStyle} from "react-native-reanimated";
import {useTiming} from "react-native-redash";
import {IconPlus} from "../../../IconPlus";
import {GalleryContainer} from "../../Add/GalleryContainer";
import {MediaType} from "../../Add/Add";
import {MediaTypeValue} from "expo-media-library";
import {TakePhoto} from "./TakePhoto";
import {updateProfile} from "../../../../redux/reducers/user-reducer";
import {UpdateProfile} from "../../../../api";

export type MediaFile = { src: string | null, type: MediaTypeValue }
const ProfileEditSchema = Yup.object().shape({
    username: Yup.string().min(2, 'Too Short!').max(25, 'Too Long!').required('Required'),
    fullName: Yup.string().min(4, 'Too Short!').max(25, 'Too Long!').required('Required')
});

const {height} = Dimensions.get('window')
export const EditProfile = ({navigation}: StackScreenProps<MainStackParams>) => {
    const insets = useSafeAreaInsets()
    const dispatch = useDispatch()
    const [changePhoto, setChangePhoto] = useState(false)
    const [isShowGallery, setIsShowGallery] = useState(false)
    const [isShowCamera, setIsShowCamera] = useState(false)
    const animGallery = useTiming(isShowGallery)
    const animChangePhoto = useTiming(changePhoto)
    const animTakePhoto = useTiming(isShowCamera)
    const [disabled, setDisabled] = useState(false)
    const [disabledAll, setDisabledAll] = useState(true)
    const [image, setImage] = useState<MediaType>({uri: ''} as MediaType)
    const {username, fullName, aboutSelf, photo, id} = useSelector(getUserInfo)
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(photo)
    const {handleChange, handleSubmit, errors, setFieldValue, values} = useFormik({
        initialValues: {
            username,
            fullName,
            aboutSelf
        },
        validationSchema: ProfileEditSchema,
        onSubmit: (values) => {
            let response: UpdateProfile = {...values, photo: currentPhoto, id}
            Object.keys(values).forEach(item => {
                switch (item) {
                    case 'username':
                        if(values[item] === username) {
                            response = {...response, username: ''}
                        }
                        break
                    case 'fullName':
                        if(values[item] === username) {
                            response = {...response, fullName: ''}
                        }
                        break
                    case 'aboutSelf':
                        if(values[item] === username) {
                            response = {...response, aboutSelf: ''}
                        }
                        break
                    default:
                        return
                }
            })
            if(response.photo === photo) {
                response = {...response, photo: ''}
            }
            setDisabledAll(false)
            Keyboard.dismiss()
            dispatch(updateProfile(response, () => navigation.goBack()))
        },
    });
    const opacity = useAnimatedStyle(() => ({
        opacity: animChangePhoto.value,
        transform: [{scale: animChangePhoto.value}]
    }))
    const translate = useAnimatedStyle(() => ({
        transform: [{translateY: interpolate(animChangePhoto.value, [0, 1], [height / 2, 0])}]
    }))
    const hideChangePhoto = () => {
        Keyboard.dismiss()
        setChangePhoto(false)
    }
    const createAlert = () =>
        Alert.alert(
            `Undo the change?`,
            "If you go back now, the changes will not be saved",
            [
                {
                    text: "Undo the change",
                    onPress: () => navigation.goBack(),
                    style: "destructive"
                },
                {text: "Continue editing", style: 'cancel'},
            ],
            {cancelable: false}
        );
    const cancelHandler = useCallback(
        () => {
            if (currentPhoto !== photo || username !== values.username ||
                fullName !== values.fullName || aboutSelf !== values.aboutSelf) {
                createAlert()
            } else {
                navigation.goBack()
            }
        }, [currentPhoto, photo, username, fullName, aboutSelf, values]);
    useEffect(() => {
        if (currentPhoto !== photo || username !== values.username ||
            fullName !== values.fullName || aboutSelf !== values.aboutSelf) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [currentPhoto, photo, username, fullName, aboutSelf, values]);

    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <View style={[{paddingTop: insets.top / 2}, styles.headerContainer]}>
                    <BorderlessButton enabled={disabledAll} onPress={cancelHandler}>
                        <Text style={[styles.cancel, {opacity: !disabledAll ? .5 : 1}]}>Cancel</Text>
                    </BorderlessButton>
                    <Text style={styles.titleHeader}>Edit Profile</Text>
                    {!disabledAll ? <ActivityIndicator style={{width: 50}} size={'small'} color={'#000'}/>
                        : <BorderlessButton enabled={disabled} onPress={() => handleSubmit()}>
                        <Text style={[styles.button, {fontSize: 18, opacity: !disabled ? .5 : 1}]}>Ready</Text>
                    </BorderlessButton>
                    }
                </View>
                <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0, .1)'}}>
                    <View style={styles.containerPhoto}>
                        <BorderlessButton onPress={() => {
                            Keyboard.dismiss();
                            setChangePhoto(true)
                        }} style={styles.ava}>
                            <View style={{width: 85, height: 85}}>
                                <Image style={styles.avaImg}
                                       source={currentPhoto ? {uri: currentPhoto} :
                                           require('../../../../../assets/defaultAva.png')}
                                       resizeMode={'cover'}/>
                                <IconPlus bottom={0} right={-5}/>
                            </View>
                            <Text style={[styles.button, {fontSize: 15, marginTop: 10}]}>Change photo profile</Text>
                        </BorderlessButton>
                    </View>
                    <View style={{paddingHorizontal: 15}}>
                        <InputProfile returnKeyType={'next'} label={'Name'}
                                      clearVal={() => setFieldValue('fullName', '')}
                                      placeholder={'Name'} onChangeText={handleChange('fullName')}
                                      value={values.fullName} error={errors.fullName}/>
                        <InputProfile returnKeyType={'next'} label={'Username'}
                                      clearVal={() => setFieldValue('username', '')}
                                      placeholder={'Username'} onChangeText={handleChange('username')}
                                      value={values.username} error={errors.username}/>
                        <InputProfile returnKeyType={'done'} maxLength={150} multiline label={'About me'}
                                      clearVal={() => setFieldValue('aboutSelf', '')}
                                      border
                                      placeholder={'About me'} onChangeText={handleChange('aboutSelf')}
                                      value={values.aboutSelf} />
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={hideChangePhoto}>
                    <Animated.View style={[styles.overlay, opacity]}/>
                </TouchableWithoutFeedback>
                <Animated.View style={[styles.containerChangePhoto, translate, {paddingBottom: insets.bottom}]}>
                    <ChangePhoto openGallery={() => {
                        setIsShowGallery(true)
                        setChangePhoto(false)
                    }} cancelChange={hideChangePhoto} openCamera={() => {
                        setIsShowCamera(true)
                        setChangePhoto(false)
                    }}/>
                </Animated.View>
            </View>
            <GalleryContainer setImage={setImage} anim={animGallery} image={image}
                              goBack={() => {
                                  setIsShowGallery(false)
                              }} goTo={(src: string) => {
                setIsShowGallery(false)
                setCurrentPhoto(src)
            }}/>
            <TakePhoto takePhoto={(src: string) => setCurrentPhoto(src)} cancel={() => setIsShowCamera(false)}
                       anim={animTakePhoto}/>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    containerPhoto: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0,0,0, .1)'
    },
    containerChangePhoto: {
        paddingHorizontal: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end'
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0, .5)',
        ...StyleSheet.absoluteFillObject,
        flex: 1
    },
    ava: {
        alignItems: "center",
        paddingVertical: 20
    },
    avaImg: {
        flex: 1,
        width: 85,
        height: 85,
        borderRadius: 80,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0,0,0, .1)'
    },
    button: {
        fontFamily: 'SegoeUISemiBold',
        fontSize: 15,
        color: '#0095f6'
    },
    titleHeader: {
        fontFamily: 'SegoeUIBold',
        fontSize: 18,
        color: '#000'
    },
    headerContainer: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0,0,0, .1)',
        paddingBottom: 10
    },
    cancel: {
        fontFamily: 'SegoeUI',
        color: '#000',
        fontSize: 18
    }
})
