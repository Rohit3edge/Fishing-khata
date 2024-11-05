import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AssetsService from "../../services/assets.service"


export const ListAsset = createAsyncThunk(
    "/post/listasset",
    async (item,thunkAPI) => {
        try {
            const data = await AssetsService.ListAsset(item);
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


export const AddAsset = createAsyncThunk(
    "/post/addasset",
    async (item,thunkAPI) => {
        try {
            const data = await AssetsService.AddAsset(item);
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

export const EditAsset = createAsyncThunk(
    "/post/editasset",
    async (item,thunkAPI) => {
        try {
            const data = await AssetsService.EditAsset(item);
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

export const UpdateAsset = createAsyncThunk(
    "/post/UpdateAsset",
    async (item,thunkAPI) => {
        try {
            const data = await AssetsService.UpdateAsset(item);
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
