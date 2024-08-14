import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LedgerService from "../../services/ledger.service";

export const Getledgergroups = createAsyncThunk(
    "/get/Getledgergroups",
    async (thunkAPI) => {
        try {
            const data = await LedgerService.Getledgergroups();
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

const initialState = {
    loading: false,
    error: "",
    user: null,
};

const LedgerSlice = createSlice({
    name: "Getledgergroups",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(Getledgergroups.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.user = null;
            })
            .addCase(Getledgergroups.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(Getledgergroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

const { reducer } = LedgerSlice;
export default reducer;
