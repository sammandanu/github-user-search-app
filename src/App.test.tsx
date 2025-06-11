import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import repositoryReducer from "./features/repository/repositorySlice";
import App from "./App";

// Mock fetch
global.fetch = jest.fn();

const createMockStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      repository: repositoryReducer,
    },
  });
};

describe("App Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("renders search bar", () => {
    render(
      <Provider store={createMockStore()}>
        <App />
      </Provider>
    );
    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
  });

  test("handles successful user search", async () => {
    const mockUsers = {
      items: [
        {
          id: 1,
          login: "testuser1",
          repos_url: "https://api.github.com/users/testuser1/repos",
        },
        {
          id: 2,
          login: "testuser2",
          repos_url: "https://api.github.com/users/testuser2/repos",
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(
      <Provider store={createMockStore()}>
        <App />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText(/Enter username/i);
    fireEvent.change(searchInput, { target: { value: "test" } });
    // Simulate clicking the search button
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    // Wait for the results
    await waitFor(() => {
      expect(screen.getByText(/Showing users for "test"/i)).toBeInTheDocument();
    });
  });

  test("handles API error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(
      <Provider store={createMockStore()}>
        <App />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText(/Enter username/i);
    fireEvent.change(searchInput, { target: { value: "test" } });
    // Simulate clicking the search button
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/Error: /i)).toBeInTheDocument();
    });
  });

  test("shows no results message when no users found", async () => {
    const mockEmptyResponse = {
      items: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEmptyResponse,
    });

    render(
      <Provider store={createMockStore()}>
        <App />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText(/Enter username/i);
    fireEvent.change(searchInput, { target: { value: "test" } });
    // Simulate clicking the search button
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/No users found for "test"/i)
      ).toBeInTheDocument();
    });
  });
});
