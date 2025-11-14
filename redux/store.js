import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice";
import updatePageReducer from "./slices/UpdatePageSlice";
import profileReducer from "./slices/ProfileSlice";
import companyReducer from "./slices/CompanySlice";
import socialMediaReducer from "./slices/SocialMediaSlice";
import marketingAssetsReducer from "./slices/MarketingAssetsSlice";
import themeReducer from "./slices/ThemeSlice";
import userImagesReducer from "./slices/UserImagesSlice";
import analizeSliceReducer from "./slices/AnalizeSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    updatePage: updatePageReducer,
    profile: profileReducer,
    company: companyReducer,
    socialMedia: socialMediaReducer,
    marketingAssets: marketingAssetsReducer,
    theme: themeReducer,
    userImages: userImagesReducer,
    analize: analizeSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
