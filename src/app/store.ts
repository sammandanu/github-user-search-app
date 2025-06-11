import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import repositoryReducer from "../features/repository/repositorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    repository: repositoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
