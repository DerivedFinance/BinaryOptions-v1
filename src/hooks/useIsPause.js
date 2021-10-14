import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import useOptionContract from "./useOptionContract";

const useIsPause = (address) => {
  const [isPause, setIsPause] = useState(false);
  const { account, library } = useWeb3React();

  const DerivedContract = useOptionContract(address);

  useEffect(() => {
    if (DerivedContract && account && address) {
      const isPaused = async () => {
        try {
          const paused = await DerivedContract?.methods.paused().call();
          setIsPause(paused);
        } catch (error) {}
      };

      isPaused();
    }
  }, [account, DerivedContract, library]);

  return isPause;
};

export default useIsPause;
