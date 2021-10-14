import React, { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

import useDerivedContract from "./useDerivedContract";

const useBidLong = async ({ amount, bids }) => {
  const { account } = useWeb3React();

  const DerivedContract = useDerivedContract();

  return useMemo(() => {
    DerivedContract.methods
      .bidLong(amount, bids)
      .estimateGas({ from: account })
      .then((gasLimit) => {
        DerivedContract.methods
          .bidLong(amount, bids)
          .send({ from: account, gasLimit })
          .then((result) => {
            // callback(result);
            return { result };
          })
          .catch((error) => {
            return { error };
          });
      })
      .catch((error) => {
        return { error };
      });
  });
};

export default useBidLong;
