import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RepositoryState {
  repositories: {
    [userId: number]: any[];
  };
  loadingRepos: {
    [userId: number]: boolean;
  };
  errorRepos: {
    [userId: number]: string | null;
  };
}

const initialState: RepositoryState = {
  repositories: {},
  loadingRepos: {},
  errorRepos: {},
};

const repositorySlice = createSlice({
  name: "repository",
  initialState,
  reducers: {
    setRepositories: (
      state,
      action: PayloadAction<{ userId: number; repos: any[] }>
    ) => {
      state.repositories[action.payload.userId] = action.payload.repos;
    },
    setLoadingRepos: (
      state,
      action: PayloadAction<{ userId: number; loading: boolean }>
    ) => {
      state.loadingRepos[action.payload.userId] = action.payload.loading;
    },
    setErrorRepos: (
      state,
      action: PayloadAction<{ userId: number; error: string | null }>
    ) => {
      state.errorRepos[action.payload.userId] = action.payload.error;
    },
  },
});

export const { setRepositories, setLoadingRepos, setErrorRepos } =
  repositorySlice.actions;

export default repositorySlice.reducer;
