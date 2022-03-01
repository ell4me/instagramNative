import {createSlice} from "@reduxjs/toolkit";
import {DispatchType} from "../store";
import {actionsAPI, PublishPostType} from "../../api";
import {CurrentUserInfo} from "./user-reducer";

const initialState = {
    isLoading: false,
    allUsers: [] as CurrentUserInfo[]
}

const reducer = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setAllUsers: (state, action) => {
            state.allUsers.push(...action.payload)
        }
    }
})


const {setLoading, setAllUsers} = reducer.actions
export const actionsUserReducer = reducer.reducer

export const publishPost = ({id,media,caption, cb}: PublishPostType) => async (dispatch: DispatchType) => {
    dispatch(setLoading(true))
    await actionsAPI.publishPost({id, caption, media})
    dispatch(setLoading(false))
    if (cb) cb()
}
export const getAllUsersInfo = (ids: string[]) => async (dispatch: DispatchType) => {
    const promiseAll: Promise<CurrentUserInfo>[] = []
    ids.forEach(id => {
        const fullInfo = actionsAPI.getFullCollectionUserInfo(id).then(r => r)
        promiseAll.push(fullInfo)
    })
    const r = await Promise.all(promiseAll)
    dispatch(setAllUsers(r))
}

