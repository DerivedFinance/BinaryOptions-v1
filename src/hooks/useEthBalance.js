import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3Utils from "web3-utils";

const useEthBalance = () => {
  const [balance, setBalance] = useState("0");
  const { account, chainId, library } = useWeb3React();

  useEffect(() => {
    if (library) {
      const getBalance = async () => {
        const ether = await library.getBalance(account);
        setBalance(Web3Utils.fromWei(Web3Utils.hexToNumberString(ether)));
      };

      getBalance();
    }
  }, [account, chainId, library]);

  return balance;
};

export default useEthBalance;
