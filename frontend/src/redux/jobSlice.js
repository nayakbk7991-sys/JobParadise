
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allJobs: [],
    singleJob: null,
    allAppliedJobs: [],
    searchedQuery: "",
    loading: false
};

const jobSlice = createSlice({
    name: "job",
    initialState,
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAppliedJobs,
    setSearchedQuery,
    setLoading
} = jobSlice.actions;

export default jobSlice.reducer;
