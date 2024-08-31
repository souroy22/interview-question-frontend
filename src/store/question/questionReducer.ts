import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type QUESTION_TYPE = {
  title: string;
  description: string;
  youtubeLink: string | null;
  websiteLink: string | null;
  verified: boolean;
  type: "CODING" | "THEORY";
  slug: string;
};

interface CreatedBy {
  _id: string;
  email: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Topic {
  _id: string;
  slug: string;
  createdBy: CreatedBy;
  verified: boolean;
  category: Category;
}

export interface QUESTION_DETAILS_TYPE {
  title: string;
  description: string;
  solution: string;
  youtubeLink: string | null;
  websiteLink: string | null;
  slug: string;
  createdBy: CreatedBy;
  verified: boolean;
  type: "THEORY" | "CODING"; // or string if the type is not strictly limited to these two
  topic: Topic;
  canModify: boolean;
}

type QuestionStateType = {
  questions: QUESTION_TYPE[];
  openedQuestion: QUESTION_DETAILS_TYPE | null;
};

const initialState: QuestionStateType = {
  questions: [],
  openedQuestion: null,
};

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<QUESTION_TYPE[]>) => {
      return {
        ...state,
        questions: action.payload,
      };
    },
    setOpenedQuestion: (
      state,
      action: PayloadAction<QUESTION_DETAILS_TYPE | null>
    ) => {
      return {
        ...state,
        openedQuestion: action.payload,
      };
    },
  },
});

export const { setQuestions, setOpenedQuestion } = questionSlice.actions;
export default questionSlice.reducer;
