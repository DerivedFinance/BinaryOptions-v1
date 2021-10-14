import { toast } from "react-toastify";

const toasterMessage = (message, options = {}) => {
  return toast.dark(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    bodyClassName: options.error ? "toaster-error" : "toaster-success",
    ...options,
  });
};

export default toasterMessage;
