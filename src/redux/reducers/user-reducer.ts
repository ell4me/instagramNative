import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DispatchType} from "../store";
import {actionsAPI, authAPI, UpdateProfile} from "../../api";
import {MediaTypeValue} from "expo-media-library";

export type PostType = {
    id: string
    caption: string
    dateCreated: number
    media: {
        src: string
        type: MediaTypeValue
        duration?: string
    },
    likes: string[],
    comments: CommentType[]
}
type CommentType = {displayName: string, text: string, userId: string}
export type CurrentUserInfo = {
    id: string
    email: string
    username: string
    fullName: string
    aboutSelf: string
    photo: string
    followers: string[]
    following: string[]
    posts: PostType[]
}

const initialState = {
    currentUser: {
        id: '',
        email: '',
        username: ''
    } as CurrentUserInfo,
    error: '',
    isLoading: false
}

const reducer = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
        setCurrentUserInfo: (state, action) => {
            state.currentUser = {...state.currentUser, ...action.payload}
        },
        setErrorApp: (state, action) => {
            state.error = action.payload.error
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setPosts: (state, action:PayloadAction<PostType[]>) => {
            state.currentUser.posts = action.payload.sort(((a, b) => b.dateCreated - a.dateCreated))
        }
    }
})

export const {setCurrentUserInfo, setErrorApp, setLoading, setPosts} = reducer.actions
export const userReducer = reducer.reducer

export const signUpUser = (email: string, password: string, username: string, fullName: string) => async (dispatch: DispatchType) => {
    try {
        dispatch(setLoading(true))
        await authAPI.signUp(email, password, username, fullName)
        dispatch(setErrorApp({error: ''}))
        dispatch(setLoading(false))
    } catch (e) {
        dispatch(setLoading(false))
        dispatch(setErrorApp({error: e.message}))
    }
}
export const signInUser = (email: string, password: string) => async (dispatch: DispatchType) => {
    try {
        dispatch(setLoading(true))
        await authAPI.signIn(email, password)
        dispatch(setErrorApp({error: ''}))
        dispatch(setLoading(false))
    } catch (e) {
        dispatch(setLoading(false))
        dispatch(setErrorApp({error: e.message}))
    }
}
export const signOutUser = () => async (dispatch: DispatchType) => {
    await authAPI.signOut()
    dispatch(setCurrentUserInfo({}))
}

export const getCurrentUserInfo = (id: string) => async (dispatch: DispatchType) => {
    const response = await actionsAPI.getCollectionUserInfo(id)
    dispatch(setCurrentUserInfo({...response}))
}

export const updateProfile = (data: UpdateProfile, cb: () => void) => async (dispatch: DispatchType) => {
    let finalData = Object.fromEntries(Object.entries(data).filter(([_,v]) => v !== ''))
    await actionsAPI.updateProfile(data)
    dispatch(setCurrentUserInfo(finalData))
    cb()
}


