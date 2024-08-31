import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type USER_TYPE = {
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  password: string;
  avatar: string | null;
  role: string;
  adminMode?: boolean;
};

type UserStateType = {
  user: null | USER_TYPE;
};

const initialState: UserStateType = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<null | USER_TYPE>) => {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
