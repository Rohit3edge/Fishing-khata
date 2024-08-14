import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth";
import settingsReducer from "./slices/settings";


const reducer = {
    auth: authReducer,
    settings: settingsReducer,
}




const store = configureStore({
    reducer: reducer,
    devTools: true,
})

export default store;