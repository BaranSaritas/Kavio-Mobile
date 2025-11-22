import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/UserSlice';
import updatePageReducer from './slices/UpdatePageSlice';
import profileReducer from './slices/ProfileSlice';
import themeReducer from './slices/ThemeSlice';
import companyReducer from './slices/CompanySlice';
import socialMediaReducer from './slices/SocialMediaSlice';
import marketingAssetsReducer from './slices/MarketingAssetsSlice';
import userImagesReducer from './slices/UserImagesSlice';
import contactsReducer from './slices/ContactsSlice';
import connectionsReducer from './slices/ConnectionsSlice';
import guestContactReducer from './slices/GuestContactSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    updatePage: updatePageReducer,
    profile: profileReducer,
    theme: themeReducer,
    company: companyReducer,
    socialMedia: socialMediaReducer,
    marketingAssets: marketingAssetsReducer,
    userImages: userImagesReducer,
    contacts: contactsReducer,
    connections: connectionsReducer,
    guestContact: guestContactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
