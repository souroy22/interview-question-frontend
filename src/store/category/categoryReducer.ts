import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CATEGORY_TYPE = {
  name: string;
  slug: string;
  verified: boolean;
  canModify: boolean;
};

type CategoryStateType = {
  categories: CATEGORY_TYPE[];
};

const initialState: CategoryStateType = {
  categories: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<CATEGORY_TYPE[]>) => {
      return {
        ...state,
        categories: action.payload,
      };
    },
    addNewCategory: (state, action: PayloadAction<CATEGORY_TYPE>) => {
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    },
  },
});

export const { setCategories, addNewCategory } = categorySlice.actions;
export default categorySlice.reducer;
