import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SettingsService from "../../services/settings.service";

export const Getsettings = createAsyncThunk(
    "/get/getsettings",
    async (thunkAPI) => {
        try {
            const data = await SettingsService.Getsettings();
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

export const Getprofile = createAsyncThunk(
    "/post/getprofile",
    async (item,thunkAPI) => {
        try {
            const data = await SettingsService.Getprofile(item);
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


export const Updatesettings = createAsyncThunk(
    "/post/settings/updateSettings",
    async (item,thunkAPI) => {
        try {
            const data = await SettingsService.Updatesettings(item);
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


export const Getunits = createAsyncThunk(
    "/get/Getunits",
    async (thunkAPI) => {
        try {
            const data = await SettingsService.Getunits();
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
    updatesettings: {}, // Add this to hold the dynamic object
};

const SettingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        updateSettingsField: (state, action) => {
            state.updatesettings = {
                ...state.updatesettings,
                ...action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(Getsettings.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.user = null;
            })
            .addCase(Getsettings.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(Getsettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // updateSettings
            .addCase(Updatesettings.pending, (state) => {
                state.loading = true;
            })
            .addCase(Updatesettings.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(Updatesettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { updateSettingsField } = SettingsSlice.actions;

export default SettingsSlice.reducer;