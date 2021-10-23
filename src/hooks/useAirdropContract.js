import useContract from "./useContract";

import ABI from "../contracts/airdrop.json";

const useAirDropContract = () => {
  return useContract("0x2ECF708e89C35aE7e6AB3EbF8a4C1CB60e958107", ABI, false);
};

export default useAirDropContract;
