import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PartiesService from "../../services/parties.service"

export const AddParties = createAsyncThunk(
    "/post/addparties",
    async (item,thunkAPI) => {
        try {
            const data = await PartiesService.AddParties(item);
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

export const ListParties = createAsyncThunk(
    "/post/listlategories",
    async (item,thunkAPI) => {
        try {
            const data = await PartiesService.ListParties(item);
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


export const SyncToledger = createAsyncThunk(
    "/post/synctoledger",
    async (item,thunkAPI) => {
        try {
            const data = await PartiesService.SyncToledger(item);
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