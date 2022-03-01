import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, Image, ActivityIndicator, Button} from "react-native";
import {StackScreenProps} from '@react-navigation/stack';
import {BorderlessButton, RectButton} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Input} from "../Input";
import * as Linking from 'expo-linking';
import * as Yup from 'yup';
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {getErrorAuth, getLoadingStatus} from "../../redux/selectors/user-selectors";
import {setErrorApp, signUpUser} from "../../redux/reducers/user-reducer";
import {AuthStackParams} from "../Navigation";

const SignUpSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Required'),
    username: Yup.string().min(2, 'Too Short!').required('Required'),
    fullName: Yup.string().min(4, 'Too Short!').max(50, 'Too Long!').required('Required')
});

export const SignUp = ({navigation}: StackScreenProps<AuthStackParams>) => {
    const [disabled, setDisabled] = useState(false)
    const error = useSelector(getErrorAuth)
    const isLoading = useSelector(getLoadingStatus)
    const dispatch = useDispatch()
    const {handleChange, handleBlur, handleSubmit, errors, touched, values, resetForm} = useFormik({
        initialValues: {
            email: '',
            password: '',
            username: '',
            fullName: ''
        },
        validationSchema: SignUpSchema,
        onSubmit: (values) => {
            const {username, email, password, fullName} = values
            dispatch(signUpUser(email, password, username, fullName))
        },
    });
    useEffect(() => {
        if (!errors.email && !errors.username && !errors.password && !errors.fullName
            && values.email && values.password && values.username && values.fullName) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [errors])
    useEffect(() => {
        if (error) {
            resetForm()
        }
    }, [error])
    return (
        <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={style.container}>
            <Image style={style.image} source={require('../../../assets/logo.png')}/>
            <Text style={style.title}>Register to watch photos and videos of your friends.</Text>
            <View>
                <Input placeholder={'E-mail'} touched={touched.email} error={errors.email}
                       onChangeText={handleChange('email')} onBlur={handleBlur('email')}
                       value={values.email} autoCompleteType={'email'}/>
                <Input placeholder={'First and last name'} touched={touched.fullName} error={errors.fullName}
                       onChangeText={handleChange('fullName')} onBlur={handleBlur('fullName')}
                       value={values.fullName} autoCompleteType={'name'}/>
                <Input placeholder={'Username'} touched={touched.username} error={errors.username}
                       onChangeText={handleChange('username')} onBlur={handleBlur('username')}
                       value={values.username} autoCompleteType={'username'}/>
                <Input placeholder={'Password'} touched={touched.password} error={errors.password}
                       onChangeText={handleChange('password')} onBlur={handleBlur('password')}
                       value={values.password} secureTextEntry/>
                <RectButton enabled={disabled} style={[style.button, {opacity: disabled ? 1 : .6}]} onPress={() => {
                    setDisabled(false)
                    handleSubmit()
                }}>
                    {isLoading
                        ? <ActivityIndicator size="small" color="#fff"/>
                        : <Text style={{fontFamily: 'SegoeUISemiBold', fontSize: 14, color: '#fff'}}>Sign Up</Text>
                    }
                </RectButton>
            </View>
            {error.length > 0 &&
            <View>
                <Text style={{
                    textAlign: "center",
                    color: '#EE2D3E',
                    fontSize: 14,
                    fontFamily: 'SegoeUI',
                    marginTop: 20
                }}>{error}</Text>
            </View>
            }
            <View style={style.containerText}>
                <Text style={style.normalText}>By registering you accept our </Text>
                <BorderlessButton onPress={() => Linking.openURL('https://help.instagram.com/581066165581870')}
                                  style={{flexDirection: 'row'}}>
                    <Text style={[style.normalText, {fontFamily: 'SegoeUISemiBold'}]}>Terms, Data Policy</Text>
                </BorderlessButton>
                <Text style={style.normalText}> and</Text>
                <BorderlessButton onPress={() => Linking.openURL('https://help.instagram.com/1896641480634370?ref=ig')}
                                  style={{flexDirection: 'row'}}>
                    <Text style={[style.normalText, {fontFamily: 'SegoeUISemiBold'}]}> Cookie Policy.</Text>
                </BorderlessButton>
            </View>
            <BorderlessButton style={style.nav} onPress={() => {
                dispatch(setErrorApp({error: ''}))
                navigation.navigate('Login')
            }}>
                <Text style={style.text}>Have an account?</Text>
                <Text style={[style.text, {color: '#0095f6'}]}> Login</Text>
            </BorderlessButton>
        </KeyboardAwareScrollView>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 50,
        backgroundColor: '#fafafa'
    },
    image: {
        marginBottom: 15
    },
    title: {
        fontFamily: 'SegoeUISemiBold',
        color: '#8e8e8e',
        fontSize: 17,
        textAlign: "center",
        marginBottom: 25
    },
    containerText: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    text: {
        fontFamily: 'SegoeUI',
        fontSize: 14
    },
    nav: {
        padding: 15,
        flexDirection: "row"
    },
    button: {
        backgroundColor: '#0095f6',
        alignItems: 'center',
        marginTop: 12,
        borderRadius: 5,
        paddingVertical: 8
    },
    normalText: {
        fontFamily: 'SegoeUI',
        color: '#8e8e8e',
        fontSize: 13
    }
})
