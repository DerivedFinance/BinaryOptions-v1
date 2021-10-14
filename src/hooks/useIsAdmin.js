import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import useOptionContract from "./useOptionContract";

const useIsAdmin = (address) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { account, library } = useWeb3React();

  const DerivedContract = useOptionContract(address);

  useEffect(() => {
    if (DerivedContract && account && address) {
      const isUserAdmin = async () => {
        try {
          const owner = await DerivedContract?.methods.getOwner().call();
          setIsAdmin(owner === account);
        } catch (error) {}
      };

      isUserAdmin();
    }
  }, [account, DerivedContract, library]);

  return isAdmin;
};

export default useIsAdmin;
