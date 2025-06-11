import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import {
  setRepositories,
  setLoadingRepos,
  setErrorRepos,
} from "../features/repository/repositorySlice";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

interface UserCardProps {
  user: {
    login: string;
    id: number;
    repos_url: string;
  };
}

const ArrowUp = MdKeyboardArrowUp as React.ComponentType<{ size?: number }>;
const ArrowDown = MdKeyboardArrowDown as React.ComponentType<{ size?: number }>;

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { repositories, loadingRepos, errorRepos } = useSelector(
    (state: RootState) => state.repository
  );

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleToggleExpand = async () => {
    if (!isExpanded && (!repositories[user.id] || errorRepos[user.id])) {
      dispatch(setLoadingRepos({ userId: user.id, loading: true }));
      dispatch(setErrorRepos({ userId: user.id, error: null }));
      try {
        const response = await fetch(user.repos_url);
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.statusText}`);
        }
        const data = await response.json();
        dispatch(setRepositories({ userId: user.id, repos: data }));
      } catch (err: any) {
        dispatch(setErrorRepos({ userId: user.id, error: err.message }));
      } finally {
        dispatch(setLoadingRepos({ userId: user.id, loading: false }));
      }
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg mb-2 overflow-hidden w-full shadow-sm">
      <div
        className="flex justify-between items-center p-3 bg-gray-200 cursor-pointer font-bold border-b border-gray-300 hover:bg-gray-300"
        onClick={handleToggleExpand}
      >
        <span>{user.login}</span>
        <span className="text-xl transition-transform duration-300 transform">
          {isExpanded ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
        </span>
      </div>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          {isExpanded && (
            <div className="p-4 bg-gray-100">
              {loadingRepos[user.id] && (
                <p className="text-gray-700">Loading repositories...</p>
              )}
              {errorRepos[user.id] && (
                <p className="text-red-500 font-bold">
                  Error: {errorRepos[user.id]}
                </p>
              )}
              {!loadingRepos[user.id] &&
                repositories[user.id] &&
                repositories[user.id].length === 0 &&
                !errorRepos[user.id] && (
                  <p className="text-gray-600">No repositories found.</p>
                )}
              {!loadingRepos[user.id] &&
                !repositories[user.id] &&
                !errorRepos[user.id] && (
                  <p className="text-gray-600">Click to load repositories.</p>
                )}
              {!loadingRepos[user.id] &&
                repositories[user.id] &&
                repositories[user.id].length > 0 && (
                  <div className="mt-3">
                    {repositories[user.id].map((repo: any) => (
                      <div
                        key={repo.id}
                        className="bg-white border border-gray-200 rounded-md p-3 mb-2 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {repo.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {repo.description || "No description"}
                        </p>
                        <p className="text-right font-bold text-blue-600 mt-2">
                          ⭐ {repo.stargazers_count}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
