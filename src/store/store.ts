import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./global/globalReducer";
import userReducer from "./user/userReducer";
import categoryReducer from "./category/categoryReducer";
import topicReducer from "./topic/topicReducer";
import questionReducer from "./question/questionReducer";

const store = configureStore({
  reducer: {
    globalReducer,
    userReducer,
    categoryReducer,
    topicReducer,
    questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
