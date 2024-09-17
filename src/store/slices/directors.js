import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import DirectorsService from "../../services/directors.service"


export const ListDirectors = createAsyncThunk(
    "/post/listdirectors",
    async (item,thunkAPI) => {
        try {
            const data = await DirectorsService.ListDirectors(item);
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


export const AddDirector = createAsyncThunk(
    "/post/directorsstore",
    async (item,thunkAPI) => {
        try {
            const data = await DirectorsService.AddDirector(item);
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

export const EditDirectors = createAsyncThunk(
    "/post/editdirector",
    async (item,thunkAPI) => {
        try {
            const data = await DirectorsService.EditDirectors(item);
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

export const UpdateDirector = createAsyncThunk(
    "/post/directorsupdate",
    async (item,thunkAPI) => {
        try {
            const data = await DirectorsService.UpdateDirector(item);
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






