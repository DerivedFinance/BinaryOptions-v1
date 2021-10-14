import useContract from "./useContract";

import ABI from "../contracts/derived.json";

const useOptionContract = (address) => {
  return useContract(address, ABI, false);
};

export default useOptionContract;
