import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOverview } from "../services/dashboard/api";

/* --------------------------------------------------------------------------
   dashboardSlice — Redux state for the Dashboard Overview section.
   Holds a single `overview` key with per-request lifecycle state
   (status: idle | loading | success | error). `refresh()` is re-dispatching
   `fetchOverview()`; there is no client-side cache, so every dispatch hits
   the API again.
   -------------------------------------------------------------------------- */

export const fetchOverview = createAsyncThunk(
  "dashboard/fetchOverview",
  async () => {
    const data = await getOverview();
    return data;
  },
);

const initialState = {
  overview: {
    status: "idle",
    data: null,
    error: null,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.overview.status = "loading";
        state.overview.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.overview.status = "success";
        state.overview.data = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.overview.status = "error";
        state.overview.error = action.error?.message ?? "Failed to load the dashboard overview.";
      });
  },
});

export const selectOverview = (state) => state.dashboard.overview;

/** Authenticated profile block ({ name, role, avatar, email }) from overview. */
export const selectOverviewUser = (state) => state.dashboard.overview.data?.user ?? null;

/** Unread notification count used by the navbar bell badge. */
export const selectNotificationCount = (state) =>
  state.dashboard.overview.data?.notificationCount ?? 0;

export default dashboardSlice.reducer;
