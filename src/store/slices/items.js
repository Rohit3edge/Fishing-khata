import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ItemsService from "../../services/items.service"

export const ListCategories = createAsyncThunk(
    "/post/listlategories",
    async (item,thunkAPI) => {
        try {
            const data = await ItemsService.ListCategories(item);
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


export const Addcategory = createAsyncThunk(
    "/post/addcategory",
    async (item,thunkAPI) => {
        try {
            const data = await ItemsService.AddCategory(item);
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

export const Additems = createAsyncThunk(
    "/post/additems",
    async (item,thunkAPI) => {
        try {
            const data = await ItemsService.AddItems(item);
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



export const Listitems = createAsyncThunk(
    "/post/listlategories",
    async (item,thunkAPI) => {
        try {
            const data = await ItemsService.ListItems(item);
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


export const Edititems = createAsyncThunk(
    "/post/listlategories",
    async (item,thunkAPI) => {
        try {
            const data = await ItemsService.Edititems(item);
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


export const Updateitems = createAsyncThunk(
    "/post/updateitems",
    async (item,thunkAPI) => {
        try {
            const data = await ItemsService.Updateitems(item);
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


export const Deleteitems = createAsyncThunk(
    "/post/deleteitems",
    async (item,thunkAPI) => {
        try {
            const data = await ItemsService.Deleteitems(item);
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