import {RootState} from "../store";

export const getPublishStatus = (state: RootState) => state.actionsUser.isLoading
export const getAllUsers = (state: RootState) => state.actionsUser.allUsers
