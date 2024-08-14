import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../services/auth.service";

export const login = createAsyncThunk(
    "auth/login",
    async({ email, password }, thunkAPI) => {
        try {
            const data = await AuthService.login({ email, password });
            return { user: data };
        } catch (error) {
            const message = 
            (error.response &&
                error.response.data &&
                error.response.data.messages &&
                error.response.data.messages.error) || 
            error.message ||
            error.toString();

        return thunkAPI.rejectWithValue({ message })
    }
});




const initialState = {
    loading: false,
    error: "",
    user: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                state.isLoggedIn = true;
                state.user = action.payload.user;  // Ensure this is a plain object
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.isLoggedIn = false;
                state.user = null;
            });
    }
});


const { reducer } = authSlice;
export default reducer;