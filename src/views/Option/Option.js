import React, { useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useHistory, useParams } from "react-router";

import BidCard from "../../components/BidCard/BidCard";
import BaseTable from "../../components/BaseTable/BaseTable";
import {
  // useDVDBalance,
  useDVDTokenContract,
  useIsPause,
  useOptionContract,
  usePinataOptions,
} from "../../hooks";

import ABI from "../../contracts/derived.json";
import "./Option.css";
import ArrowBack from "@material-ui/icons/ArrowBack";

import usePinataActivities from "../../hooks/usePinataActivities";
import { pinActivityData } from "../../utils/storeData";
import Spinner from "./../../components/Spinner/Spinner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import toasterMessage from "../../utils/toasterMessage";
import { LONG_FAILED, LONG_SUCCESS, SHORT_FAILED, SHORT_SUCCESS, CLAIM_FAILED, CLAIM_SUCCESS } from "../../constants";

const Option = () => {
  const [contractDetails, setContractDetails] = useState({
    price: 0,
    hasBidEnded: false,
  });
  const [onPauseError, setOnpauseError] = useState(false);
  const { account, active } = useWeb3React();
  const { contractAddress } = useParams();
  const isPause = useIsPause(contractAddress);
  const { result } = usePinataActivities(account, contractAddress);
  const { optionList } = usePinataOptions(process.env.REACT_APP_ADMIN_WALLET);
  let opt = {};
  const options = useMemo(() => optionList?.filter((option) => option.contract === contractAddress), [optionList.length, contractAddress]);
  opt = options?.length > 0 && options[0];
  if (result) {
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result.length - 1; j++) {
        if (result[j].date < result[j + 1].date) {
          const temp = result[j + 1];
          result[j + 1] = result[j];
          result[j] = temp;
        }
      }
    }
  }
  const [optionContract, setOptionContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOperation, setIsOperation] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const DVDContract = useDVDTokenContract();
  const ClaimContract = useOptionContract(contractAddress);

  useEffect(() => {
    if (active && account && window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const OptionContract = new window.web3.eth.Contract(ABI, contractAddress);

      setOptionContract(OptionContract);
    }
  }, [contractAddress, active, account]);

  useEffect(() => {
    const getContractDetails = async () => {
      setIsLoading(true);
      try {
        if (!optionContract) {
          return;
        }
        const price = await optionContract.methods.getStrikePrice().call({ from: account });

        const bidPeriod = await optionContract.methods.getBidPeriodLimit().call({ from: account });
        setContractDetails({
          price,
          hasBidEnded: Date.now() > bidPeriod * 1000,
        });
        setIsLoading(false);
        return { price };
      } catch (error) {
        setIsLoading(false);
      }
    };

    getContractDetails();
  }, [optionContract]);

  const onLongClick = async (amount) => {
    if (!isPause) {
      setIsOperation(true);
      DVDContract.methods
        .approve(contractAddress, `${amount * 10000000000000}`)
        .send({ from: account, gasLimit: 600000 })
        .then(() => {
          optionContract.methods
            .bidLong(amount)
            .estimateGas({ from: account })
            .then((gasLimit) => {
              optionContract.methods
                .bidLong(amount)
                .send({ from: account, gasLimit })
                .then(async (response) => {
                  await pinActivityData(
                    {
                      wallet: account,
                      date: Date.now(),
                      type: "Long",
                      position: "Long",
                      amount: amount,
                      tx: response.transactionHash,
                    },
                    {
                      pinataMetadata: {
                        name: "activity",
                        keyvalues: {
                          wallet: account,
                          options: contractAddress,
                          isActive: "true",
                        },
                      },
                    }
                  ).then(() => {
                    result.push({
                      wallet: account,
                      date: Date.now(),
                      type: "Long",
                      position: "Long",
                      amount: amount,
                      tx: response.transactionHash,
                    });
                    setClaimed(new Date());
                    setIsOperation(false);
                    toasterMessage(LONG_SUCCESS);
                  });
                })
                .catch((error) => {
                  setIsOperation(false);
                  toasterMessage(error.message || LONG_FAILED, { error: true });
                });
            })
            .catch((error) => {
              setIsOperation(false);
              toasterMessage(error.message || LONG_FAILED, { error: true });
            });
        })
        .catch((error) => {
          setIsOperation(false);
          toasterMessage(error.message || LONG_FAILED, { error: true });
        });
    } else {
      setOnpauseError(true);
    }
  };

  const onShortClick = async (amount) => {
    if (!isPause) {
      setIsOperation(true);
      DVDContract.methods
        .approve(contractAddress, `${amount * 10000000000000}`)
        .send({ from: account, gasLimit: 600000 })
        .then(() => {
          optionContract.methods
            .bidShort(amount)
            .estimateGas({ from: account })
            .then((gasLimit) => {
              optionContract.methods
                .bidShort(amount)
                .send({ from: account, gasLimit })
                .then(async (response) => {
                  await pinActivityData(
                    {
                      wallet: account,
                      date: Date.now(),
                      type: "Short",
                      position: "Short",
                      amount: amount,
                      tx: response.transactionHash,
                    },
                    {
                      pinataMetadata: {
                        name: "activity",
                        keyvalues: {
                          wallet: account,
                          options: contractAddress,
                          isActive: "true",
                        },
                      },
                    }
                  ).then(() => {
                    result.push({
                      wallet: account,
                      date: Date.now(),
                      type: "Short",
                      position: "Short",
                      amount: amount,
                      tx: response.transactionHash,
                    });
                    setClaimed(new Date());
                    setIsOperation(false);
                    toasterMessage(SHORT_SUCCESS);
                  });
                })
                .catch((error) => {
                  setIsOperation(false);
                  toasterMessage(error.message || SHORT_FAILED, {
                    error: true,
                  });
                });
            })
            .catch((error) => {
              setIsOperation(false);
              toasterMessage(error.message || SHORT_FAILED, { error: true });
            });
        })
        .catch((error) => setIsOperation(false));
    } else {
      setOnpauseError(true);
    }
  };

  const onClaimClick = async () => {
    if (!isPause) {
      setIsOperation(true);
      ClaimContract.methods
        .claim()
        .estimateGas({ from: account })
        .then((gasAmount) => {
          ClaimContract.methods
            .claim()
            .send({ from: account, gasLimit: gasAmount })
            .then(async (response) => {
              await pinActivityData(
                {
                  wallet: account,
                  date: Date.now(),
                  type: "Claim",
                  position: "Claim",
                  amount: "-",
                  tx: response.transactionHash,
                },
                {
                  pinataMetadata: {
                    name: "activity",
                    keyvalues: {
                      wallet: account,
                      options: contractAddress,
                      isActive: "true",
                    },
                  },
                }
              ).then(() => {
                result.push({
                  wallet: account,
                  date: Date.now(),
                  type: "Claim",
                  position: "Claim",
                  amount: "-",
                  tx: response.transactionHash,
                });
                setClaimed(new Date());
                setIsOperation(false);
                toasterMessage(CLAIM_SUCCESS);
              });
            })
            .catch((err) => {
              setIsOperation(false);
              toasterMessage(CLAIM_FAILED, { error: true });
            });
        })
        .catch((err) => {
          setIsOperation(false);
          toasterMessage(CLAIM_FAILED, { error: true });
        });
    } else {
      setOnpauseError(true);
      toasterMessage(CLAIM_FAILED, { error: true });
    }
  };
  const [search, setSearch] = useState("");
  const textchange = (event) => {
    setSearch(event.target.value);
  };
  const history = useHistory();

  const onBack = () => {
    history.push("/");
  };
  return (
    <>
      {isOperation && <Spinner />}
      <div className="option-container">
        <div className="bid-container">
          <section className="Option_images">
            <button className="Button_button" onClick={onBack} style={{ padding: "5px", color: "white" }}>
              <ArrowBack />
            </button>
            <div style={{ margin: "auto" }}>
              {isLoading && !opt.currencyLogo ? (
                <SkeletonTheme color="#202020" highlightColor="#444">
                  <section>
                    <Skeleton height={40} width={40} />
                  </section>
                </SkeletonTheme>
              ) : (
                <img width="40" height="40" src={opt?.currencyLogo || "https://gateway.pinata.cloud/ipfs/QmNRYGM4mgbFp83ff7KFXQrieFiNk9zuWTmD1CqiuDAPB8"} alt="" style={{ borderRadius: 20 }} />
              )}
              &nbsp;&nbsp;&nbsp;
              {isLoading ? (
                <SkeletonTheme color="#333" highlightColor="#888">
                  <Skeleton width={50} />
                </SkeletonTheme>
              ) : (
                opt?.currency
              )}
            </div>
          </section>
          <BidCard
            isPaused={isPause}
            contractAddress={contractAddress}
            price={contractDetails.price}
            onLongClick={onLongClick}
            onShortClick={onShortClick}
            hasBidEnded={contractDetails.hasBidEnded}
            claimed={claimed}
            onClaimClick={onClaimClick}
            isLoading={isLoading}
            onPauseError={onPauseError}
          />
        </div>

        <input type="text" className="activity_search" placeholder="Search by type or Position" onChange={textchange} />
        <div className="row scroller">
          <BaseTable header={["Time", "Bid", "Position", "Amount", "Tx"]} data={result.length > 0 ? result : []} search={search} />
        </div>
      </div>
    </>
  );
};

export default Option;
