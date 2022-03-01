import {RootState} from "../store";

export const getErrorAuth = (state: RootState) => state.user.error
export const getUserInfo = (state: RootState) => state.user.currentUser
export const getLoadingStatus = (state: RootState) => state.user.isLoading

