import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MembersService from "../../services/members.service"


export const ListMembers = createAsyncThunk(
    "/post/listmembers",
    async (item,thunkAPI) => {
        try {
            const data = await MembersService.ListMembers(item);
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

export const AddMembers  = createAsyncThunk(
    "/post/addmembers",
    async (item,thunkAPI) => {
        try {
            const data = await MembersService.AddMembers(item);
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


export const EditMembers = createAsyncThunk(
    "/post/editfarmer",
    async (item,thunkAPI) => {
        try {
            const data = await MembersService.EditMembers(item);
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

export const Updatemembers  = createAsyncThunk(
    "/post/updatefarmer",
    async (item,thunkAPI) => {
        try {
            const data = await MembersService.Updatemembers(item);
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
