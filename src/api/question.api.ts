import AXIOS from "../configs/axios.confog";

export const getAllQuestions = async (
  categorySlug: string | null = null,
  topicSlug: string | null = null,
  searchValue: string | null = null,
  verified: boolean | null = null
) => {
  const query: any = {};
  if (categorySlug) {
    query["categorySlug"] = categorySlug;
  }
  if (topicSlug) {
    query["topicSlug"] = topicSlug;
  }
  if (searchValue?.trim()) {
    query["searchValue"] = searchValue.trim();
  }
  if (verified) {
    query["verified"] = verified;
  }
  const res: any = await AXIOS.get("/question/all", { params: query });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const getQuestionDetails = async (questionSlug: string) => {
  const res: any = await AXIOS.get(`/question/details/${questionSlug}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
