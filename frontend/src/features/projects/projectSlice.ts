import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectsUIState {
  searchQuery: string;
  sortBy: 'latest' | 'oldest' | 'title';
}

const initialState: ProjectsUIState = {
  searchQuery: '',
  sortBy: 'latest',
};

export const projectSlice = createSlice({
  name: 'projectsUI',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'latest' | 'oldest' | 'title'>) => {
      state.sortBy = action.payload;
    },
    resetProjectsUI: () => initialState,
  },
});

export const { setSearchQuery, setSortBy, resetProjectsUI } = projectSlice.actions;
export default projectSlice.reducer;
