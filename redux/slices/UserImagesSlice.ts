import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import { Share } from "react-native";
import Axios from "../../api/axiosInstance";

interface UserImagesState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  bannerImg: string | null;
  profileImg: string | null;
}

const initialState: UserImagesState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  bannerImg: null,
  profileImg: null,
};

/* ---------------------------  THUNKS  --------------------------- */

export const getDownloadOtherProfilesVCF = createAsyncThunk<
  { success: boolean }, // return type
  { cardId: string; signal?: AbortSignal } // args
>(
  "other-profile-management/download-vcf",
  async ({ cardId, signal }, { rejectWithValue }) => {
    try {
      const response = await Axios.get(
        `/other-profile-management/download-vcf/${cardId}`,
        {
          responseType: "blob",
          signal,
        }
      );

      const fileName = `kavio-contact-${cardId}.vcf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const reader = new FileReader();
      reader.readAsDataURL(response.data);

      return await new Promise<{ success: boolean }>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64data = (reader.result as string).split(",")[1];

            await FileSystem.writeAsStringAsync(fileUri, base64data, {
              encoding: FileSystem.EncodingType.Base64,
            });

            await Share.share({
              url: fileUri,
              title: "Kişi Kartı",
              message: "VCF Dosyası",
            });

            resolve({ success: true });
          } catch (err) {
            reject(err);
          }
        };

        reader.onerror = reject;
      });
    } catch (error: any) {
      if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
        return rejectWithValue("İstek iptal edildi");
      }

      if (!error.response) throw error;

      return rejectWithValue(error.response.data?.message || "Bir hata oluştu");
    }
  }
);

/* ---------------------------  SLICE  --------------------------- */

const UserImagesSlice = createSlice({
  name: "userImages",
  initialState,
  reducers: {
    resetUserImages(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.bannerImg = null;
      state.profileImg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDownloadOtherProfilesVCF.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDownloadOtherProfilesVCF.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "VCF dosyası indirildi";
      })
      .addCase(getDownloadOtherProfilesVCF.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = (action.payload as string) || "Beklenmeyen Bir Hata Oluştu";
      });
  },
});

/* ---------------------------  EXPORTS  --------------------------- */

export const { resetUserImages } = UserImagesSlice.actions;

/**
 * ✨ İşte eksik olan şey buydu!
 * store.ts default export bekliyor → bunu ekledik.
 */
export default UserImagesSlice.reducer;
