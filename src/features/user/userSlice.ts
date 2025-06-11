import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  searchQuery: string;
  users: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  searchQuery: "",
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSearchQuery, setUsers, setLoading, setError } =
  userSlice.actions;

export default userSlice.reducer;
