import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FarmersService from "../../services/farmer.service"


export const Listfarmer = createAsyncThunk(
    "/post/listfarmer",
    async (item,thunkAPI) => {
        try {
            const data = await FarmersService.ListFarmer(item);
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

export const Addfarmer  = createAsyncThunk(
    "/post/addfarmer",
    async (item,thunkAPI) => {
        try {
            const data = await FarmersService.AddFarmer(item);
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


