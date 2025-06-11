import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (username: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [username, setUsername] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(username);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(username);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 bg-gray-200 rounded-lg shadow-md w-full max-w-md mx-auto my-5">
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="w-full p-2 mb-3 border border-gray-300 rounded text-base"
      />
      <button
        onClick={handleSearchClick}
        className="w-full p-2 bg-blue-500 text-white rounded text-base cursor-pointer transition-colors duration-200 hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
