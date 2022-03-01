import {configureStore} from "@reduxjs/toolkit";
import {userReducer} from "./reducers/user-reducer";
import {actionsUserReducer} from "./reducers/actionsUser-reducer";

const rootReducer = {
    user: userReducer,
    actionsUser: actionsUserReducer
}

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware()
})

export type RootState = ReturnType<typeof store.getState>
export type DispatchType = typeof store.dispatch
