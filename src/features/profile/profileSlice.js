import {createAsyncThunk, createSlice, isRejectedWithValue} from "@reduxjs/toolkit";
import {profileAPI} from "../../api/api.js";

const initialState = {
    profileData: {},
    status: 'idle',
    error: null,
}

export const fetchProfile = createAsyncThunk('profile/fetchProfile', /**
 @param userId {number}
 @param thunkAPI {object}
 */
async(userId, thunkAPI) => {
    try {
        return await profileAPI.getProfile(userId)
    } catch (e) {
        return thunkAPI.rejectWithValue(e.message)
    }
})

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: {
            [fetchProfile.pending]: (state, action) => {
                state.status = 'pending'
            },
            [fetchProfile.rejected]: (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            },
            [fetchProfile.fulfilled]: (state, action) => {
                state.status = 'success'
                state.profileData = action.payload
            },
    }
})



export const getProfileData = (state) => state.profile.profileData
export const getProfileStatus = (state) => state.profile.status
export const getProfileError = (state) => state.profile.error

export default profileSlice.reducer