import useContract from "./useContract";

import ABI from "../contracts/derived.json";

const useDerivedContract = () => {
  // const cont = useContract(
  //   "0xeA8f40BFAdBEe324ebD23D02EF10cE17FA49366E",
  //   ABI,
  //   false
  // );
  const cont = useContract("0x42eE8a75099876DBDcDE8e2aBE9FaD4f72994873", ABI, false);
  return cont;
};

export default useDerivedContract;
