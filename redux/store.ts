import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/UserSlice';
import updatePageReducer from './slices/UpdatePageSlice';
import profileReducer from './slices/ProfileSlice';
import themeReducer from './slices/ThemeSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    updatePage: updatePageReducer,
    profile: profileReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
