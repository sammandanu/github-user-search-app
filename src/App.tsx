import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./app/store";
import {
  setSearchQuery,
  setUsers,
  setLoading,
  setError,
} from "./features/user/userSlice";
import SearchBar from "./components/SearchBar";
import UserCard from "./components/UserCard";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { searchQuery, users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const handleSearch = async (username: string) => {
    if (username.trim() === "") return;

    dispatch(setSearchQuery(username));
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setUsers([]));

    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${username}&per_page=5`
      );
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      const data = await response.json();
      dispatch(setUsers(data.items));
    } catch (err: any) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col items-center p-5 font-sans bg-gray-100 min-h-screen">
      <SearchBar onSearch={handleSearch} />
      {loading && (
        <div className="flex items-center justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-lg text-gray-700">Loading users...</p>
        </div>
      )}
      {error && (
        <p className="mt-2 text-lg text-red-500 font-bold">Error: {error}</p>
      )}

      {!loading && searchQuery && users.length === 0 && !error && (
        <p className="mt-4 text-lg text-gray-700">
          No users found for "{searchQuery}".
        </p>
      )}

      {searchQuery && users.length > 0 && (
        <div className="mt-4 text-lg text-gray-800 font-bold">
          Showing users for "{searchQuery}"
        </div>
      )}

      <div className="w-full max-w-md mt-5">
        {users.map((user: any) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default App;
