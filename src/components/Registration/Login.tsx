import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, Image, ActivityIndicator} from "react-native";
import {StackScreenProps} from '@react-navigation/stack';
import {BorderlessButton, RectButton} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Input} from "../Input";
import * as Yup from 'yup';
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {getErrorAuth, getLoadingStatus} from "../../redux/selectors/user-selectors";
import {setErrorApp, signInUser} from "../../redux/reducers/user-reducer";
import {useIsFocused} from "@react-navigation/native";
import {AuthStackParams} from "../Navigation";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
        .min(4, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required')
});

export const Login = ({navigation}: StackScreenProps<AuthStackParams>) => {
    const [disabled, setDisabled] = useState(false)
    const error = useSelector(getErrorAuth)
    const isLoading = useSelector(getLoadingStatus)
    const dispatch = useDispatch()
    const focused = useIsFocused()
    const {handleChange, handleBlur, handleSubmit, errors, touched, values, resetForm} = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: LoginSchema,
        onSubmit: ({email, password}) => {
            dispatch(signInUser(email, password))
        },
    });
    useEffect(() => {
        if(!errors.email && !errors.password && values.email && values.password) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [errors])
    useEffect(() => {
        if(error) {
            resetForm()
        }
    }, [error])
    useEffect(() => {
        if(!focused && error){
            dispatch(setErrorApp({error: ''}))
        }
    }, [focused, error])
    return (
        <KeyboardAwareScrollView scrollEnabled={false} contentContainerStyle={style.container}>
            <Image style={style.image} source={require('../../../assets/logo.png')}/>
            <View>
                <Input placeholder={'E-mail'} touched={touched.email} error={errors.email}
                       onChangeText={handleChange('email')} onBlur={handleBlur('email')}
                       value={values.email} autoCompleteType={'email'}/>
                <Input placeholder={'Password'} touched={touched.password} error={errors.password}
                       onChangeText={handleChange('password')} onBlur={handleBlur('password')}
                       value={values.password} secureTextEntry/>
                <RectButton enabled={disabled} style={[style.button, {opacity: disabled ? 1 : .6}]} onPress={() => {
                    setDisabled(false)
                    handleSubmit()
                }}>
                    {isLoading
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Text style={{fontFamily: 'SegoeUISemiBold', fontSize: 14, color: '#fff'}}>Sign In</Text>
                    }
                </RectButton>
            </View>
            {error.length > 0 &&
            <View>
                <Text style={{textAlign: "center", color: '#EE2D3E', fontSize: 14, fontFamily: 'SegoeUI', marginTop: 20}}>{error}</Text>
            </View>
            }
            <BorderlessButton style={style.nav} onPress={() => {
                navigation.navigate('SignUp')
            }}>
                <Text style={style.text}>Don't have an account yet?</Text>
                <Text style={[style.text, {color: '#0095f6'}]}> Sign Up</Text>
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
