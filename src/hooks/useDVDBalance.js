import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import useDVDTokenContract from "./useDVDTokenContract";

const useDVDBalance = () => {
  const [DVDBalance, setDVDBalance] = useState(0);
  const { account } = useWeb3React();

  const DerivedTokenContract = useDVDTokenContract();

  useEffect(() => {
    if (DerivedTokenContract && account) {
      const getBalance = async () => {
        const dvdToken = await DerivedTokenContract?.methods
          .balanceOf(account)
          .call();
        setDVDBalance(Number(dvdToken) / 10000000000000);
      };

      getBalance();
    }
  }, [account, DerivedTokenContract]);

  return DVDBalance;
};

export default useDVDBalance;
