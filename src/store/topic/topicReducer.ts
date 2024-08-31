import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Topic_TYPE = {
  name: string;
  slug: string;
  verified: boolean;
  canModify: boolean;
  category: { name: string; slug: string };
};

type CategoryStateType = {
  topics: Topic_TYPE[];
};

const initialState: CategoryStateType = {
  topics: [],
};

export const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setTopic: (state, action: PayloadAction<Topic_TYPE[]>) => {
      return {
        ...state,
        topics: action.payload,
      };
    },
    addNewTopic: (state, action: PayloadAction<Topic_TYPE>) => {
      return {
        ...state,
        topics: [...state.topics, action.payload],
      };
    },
  },
});

export const { setTopic, addNewTopic } = topicSlice.actions;
export default topicSlice.reducer;
