import useContract from "./useContract";

import ABI from "../contracts/airdrop.json";

const useAirDropContract = () => {
  console.log("USDx Address:" + process.env.REACT_APP_USDX_CLAIM_ADDRESS);
  return useContract(process.env.REACT_APP_USDX_CLAIM_ADDRESS, ABI, false);
};

export default useAirDropContract;
