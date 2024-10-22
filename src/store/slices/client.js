import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import clientsService from "../../services/client.service"


export const Listclients = createAsyncThunk(
    "/post/listclients",
    async (item,thunkAPI) => {
        try {
            const data = await clientsService.Listclients(item);
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


export const Addclients = createAsyncThunk(
    "/post/addclients",
    async (item,thunkAPI) => {
        try {
            const data = await clientsService.Addclients(item);
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

export const Editclients = createAsyncThunk(
    "/post/editclients",
    async (item,thunkAPI) => {
        try {
            const data = await clientsService.Editclients(item);
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

export const Updateclients = createAsyncThunk(
    "/post/updateclients",
    async (item,thunkAPI) => {
        try {
            const data = await clientsService.Updateclients(item);
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


export const CheckEmailclients = createAsyncThunk(
    "/post/editclients",
    async (item,thunkAPI) => {
        try {
            const data = await clientsService.CheckEmailclients(item);
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

export const CheckGSTclients = createAsyncThunk(
    "/post/checkGSTclients",
    async (item,thunkAPI) => {
        try {
            const data = await clientsService.CheckGSTclients(item);
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


export const GetState = createAsyncThunk(
    "/post/getstate",
    async (thunkAPI) => {
        try {
            const data = await clientsService.GetState();
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

export const LicenceCheck = createAsyncThunk(
    "/post/checkGSTclients",
    async (item,thunkAPI) => {
        try {
            const data = await clientsService.LicenceCheck(item);
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
