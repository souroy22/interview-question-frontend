import AXIOS from "../configs/axios.confog";

export const createCategory = async (data: any) => {
  const res: any = await AXIOS.post("/category/create", { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const updateCategory = async (data: any, slug: string) => {
  const res: any = await AXIOS.patch(`/category/update/${slug}`, { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res: any = await AXIOS.delete(`/category/delete/${id}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const getCategories = async (
  page: number = 1,
  searchValue: string = "",
  isVerified: boolean | null = null
) => {
  const query: any = { page, limit: 10 };
  if (searchValue?.trim()) {
    query["searchValue"] = searchValue;
  }
  if (isVerified !== null) {
    query["isVerified"] = isVerified;
  }
  const res: any = await AXIOS.get(`/category/all`, { params: query });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
