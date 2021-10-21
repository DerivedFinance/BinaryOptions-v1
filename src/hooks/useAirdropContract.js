import useContract from "./useContract";

import ABI from "../contracts/airdrop.json";

const useAirDropContract = (address) => {
  return useContract(address, ABI, false);
};

export default useAirDropContract;
