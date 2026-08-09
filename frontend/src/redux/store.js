import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardSlice";

/* --------------------------------------------------------------------------
   Redux store — composed from per-feature slices. The dashboard slice owns
   the Overview section (greeting + KPI cards).
   -------------------------------------------------------------------------- */

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});
