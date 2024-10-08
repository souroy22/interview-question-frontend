import AXIOS from "../configs/axios.confog";

export const createTopic = async (data: any) => {
  const res: any = await AXIOS.post("/topic/create", { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const updateTopic = async (data: any, slug: string) => {
  const res: any = await AXIOS.patch(`/topic/update/${slug}`, { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const deleteTopic = async (id: string) => {
  const res: any = await AXIOS.delete(`/topic/delete/${id}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const getTopics = async (
  category: string,
  page: number = 1,
  searchValue: string = "",
  isVerified: boolean | null = null
) => {
  const query: any = { page };
  if (searchValue?.trim()) {
    query["searchValue"] = searchValue;
  }
  if (isVerified !== null) {
    query["isVerified"] = isVerified;
  }
  if (category?.trim()) {
    query["categorySlug"] = category;
  }
  const res: any = await AXIOS.get(`/topic/all`, {
    params: query,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
