import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CommonImgUploadService from "../../services/commonimgupload.service"


export const CommonImgUpload = createAsyncThunk(
    "/post/commonimgiupload",
    async (item,type,thunkAPI) => {
        try {
            const data = await CommonImgUploadService.CommonimgUpload(item,type);
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
