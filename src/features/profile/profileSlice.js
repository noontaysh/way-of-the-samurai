import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {profileAPI} from "../../api/socialNetworkApi.js";

const initialState = {
    profileData: {},
    status: 'idle',
    error: null,
    userStatus: '',
    statusError: null,
    photoError: null,
}

export const fetchProfile = createAsyncThunk('profile/fetchProfile', /**
 @param userId {string}
 @param rejectWithValue {function}
 */
async (userId, {rejectWithValue}) => {
    try {
        return await profileAPI.getProfile(userId)
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const fetchStatus = createAsyncThunk('profile/fetchStatus', /**
 @param userId {string}
 @param rejectWithValue {function}
 */
async (userId, {rejectWithValue}) => {
    try {
        return await profileAPI.getStatus(userId)
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const updateProfile = createAsyncThunk('profile/updateProfile', /**
    @param profile {object}
    @param rejectWithValue {function}
    @param dispatch {function}
    @param getState {function}
 */
async (profile, {rejectWithValue, dispatch, getState}) => {
    try {
        const response = await profileAPI.updateProfile(profile)
        if (response.data.resultCode === 0) {
            dispatch(fetchProfile(getState().auth.userId))
        } else {
            return rejectWithValue(response.data.messages[0])
        }
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const postStatus = createAsyncThunk('profile/postStatus', /**
 @param status {string}
 @param rejectWithValue {function}
 @param dispatch {function}
 */
async (status, {rejectWithValue, dispatch}) => {
    try {
        const response = await profileAPI.postStatus(status)
        if (response.data.resultCode === 0) {
            return status
        } else {
            return rejectWithValue(response.data.messages[0])
        }
    } catch (e) {
        return rejectWithValue(e.message)
    }
})

export const updatePhoto = createAsyncThunk('profile/updatePhoto', /**
 @param rejectWithValue {function}
 @param photo {object}
 */
async(photo, {rejectWithValue}) => {
    try {
        const response = await profileAPI.updatePhoto(photo)

        if (response.data.resultCode === 0) {
            return response.data.data.photos
        } else {
            return rejectWithValue(response.data.messages[0])
        }
    } catch (e) {
        return rejectWithValue(e.message)
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
        [fetchStatus.fulfilled]: (state, action) => {
            state.userStatus = action.payload
            state.statusError = null
        },
        [fetchStatus.rejected]: (state, action) => {
            state.statusError = action.payload
        },
        [postStatus.rejected]: (state, action) => {
            state.statusError = action.payload
        },
        [postStatus.fulfilled]: (state, action) => {
            state.userStatus = action.payload
            state.statusError = null
        },
        [updatePhoto.fulfilled]: (state, action) => {
            state.profileData.photos = action.payload
            state.photoError = null
        },
        [updatePhoto.rejected]: (state, action) => {
            state.photoError = action.payload
            state.error = null
        },
        [updateProfile.rejected]: (state, action) => {
            state.error = action.payload
        }
    }
})


export const getProfileData = (state) => state.profile.profileData
export const getProfileStatus = (state) => state.profile.status
export const getProfileError = (state) => state.profile.error
export const getUserStatus = (state) => state.profile.userStatus
export const getPhotoError = (state) => state.profile.photoError

export default profileSlice.reducer