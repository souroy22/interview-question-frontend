import toast from "react-hot-toast";

const notification = {
  success: (msg: string) => {
    toast.success(msg);
  },
  error: (msg: string) => {
    toast.error(msg);
  },
};

export default notification;
