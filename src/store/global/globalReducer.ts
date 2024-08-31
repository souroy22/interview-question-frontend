import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { customLocalStorage } from "../../utils/customLocalStorage";

type GlobalStateType = {
  theme: string;
};

const initialState: GlobalStateType = {
  theme: "light",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUserTheme: (state, action: PayloadAction<string>) => {
      customLocalStorage.setData("userTheme", action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    },
  },
});

export const { setUserTheme } = globalSlice.actions;
export default globalSlice.reducer;
