import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ShareApplicationsService from "../../services/share-applications.service"


export const ListShareApplications = createAsyncThunk(
    "/post/listshareapplications",
    async (item,thunkAPI) => {
        try {
            const data = await ShareApplicationsService.ListShareApplications(item);
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

export const AddShareApplications = createAsyncThunk(
    "/post/addshareapplications",
    async (item,thunkAPI) => {
        try {
            const data = await ShareApplicationsService.AddShareApplications(item);
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


export const EditShareApplications = createAsyncThunk(
    "/post/editshareapplications",
    async (item,thunkAPI) => {
        try {
            const data = await ShareApplicationsService.EditShareApplications(item);
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

export const updateShareApplications  = createAsyncThunk(
    "/post/updatefarmer",
    async (item,thunkAPI) => {
        try {
            const data = await ShareApplicationsService.updateShareApplications(item);
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
