import AXIOS from "../configs/axios.confog";

export const getUserData = async () => {
  const res: any = await AXIOS.get("/user/get-user");
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const updateUserData = async (data: any) => {
  const res: any = await AXIOS.patch("/user/update", { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
