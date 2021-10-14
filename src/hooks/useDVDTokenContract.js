import useContract from "./useContract";

import ABI from "../contracts/derivedToken.json";

const useDVDTokenContract = () => {
  return useContract(process.env.REACT_APP_DVD_ADDRESS, ABI, false);
};

export default useDVDTokenContract;
