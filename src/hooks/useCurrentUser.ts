import {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {getCurrentUserInfo} from "../redux/reducers/user-reducer";
import firebase from "firebase";


export const useCurrentUser = () => {
    const [user, setUser] = useState<boolean | null>(null)
    const dispatch = useDispatch()
    useEffect(() => {
        firebase.auth().onAuthStateChanged((snapshot) => {
                if(snapshot) {
                    setUser(true)
                    dispatch(getCurrentUserInfo(snapshot.uid))
                } else {
                    setUser(false)
                }
        })
    }, [])
    return user
};
