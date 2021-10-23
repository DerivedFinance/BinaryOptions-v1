import useContract from "./useContract";

import ABI from "../contracts/airdrop.json";

const useAirDropContract = () => {
  return useContract(process.env.REACT_APP_USDX_CLAIM_ADDRESS, ABI, false);
};

export default useAirDropContract;
