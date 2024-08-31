import AXIOS from "../configs/axios.confog";

export const signin = async (data: any) => {
  const res: any = await AXIOS.post("/auth/signin", {
    ...data,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const signup = async (data: any) => {
  const res: any = await AXIOS.post("/auth/signup", {
    ...data,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const signout = async () => {
  const res: any = await AXIOS.get("/auth/signout");
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
