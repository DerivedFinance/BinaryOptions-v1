import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { formatTxTimestamp, isValidDate } from "../../utils/formatters";

import MetamaskButton from "../MetamaskButton/MetamaskButton";

import TrendingUp from "@material-ui/icons/TrendingUp";
import TrendingDown from "@material-ui/icons/TrendingDown";
import Add from "@material-ui/icons/Add";
import Remove from "@material-ui/icons/Remove";

import "./BidCard.css";
import { useDVDBalance, useOptionContract } from "../../hooks";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Form } from "react-bootstrap";
import CountdownTimer from "../OptionCard/countDownTimer";

const BidCard = ({ onLongClick, onShortClick, contractAddress, price, hasBidEnded, claimed, onClaimClick, isLoading, isPaused, onPauseError }) => {
  const { active, account } = useWeb3React();
  const ClaimContract = useOptionContract(contractAddress);
  const [bidAmount, setBidAmount] = useState(1);
  const [isWinner, setIsWinner] = useState(false);
  const [hasContractExpire, setHasContractExpire] = useState(false);
  const [getContractExpiry, setGetContractExpiry] = useState({});
  const [DVDBalanceError, setDVDBalanceError] = useState(false);
  const [getAssetPrice, setGetAssetPrice] = useState({});
  const [BidEnd, setGetContractBidEnd] = useState({});
  const [options, setOptions] = useState({
    BidEnd: new Date(),
  });
  const DVDBalance = useDVDBalance();

  useEffect(() => {
    if (ClaimContract?.methods) {
      const getOwner = async () => {
        const isWinner = await ClaimContract.methods
          .isWinner(account)
          .call({ from: account })
          .catch((error) => {});
        setIsWinner(isWinner);

        const hasContractExpire = await ClaimContract.methods
          .hasContractExpire()
          .call({ from: account })
          .catch((error) => {});
        setHasContractExpire(hasContractExpire);

        //get bid expiry date
        const getContractExpiry = await ClaimContract.methods
          .getContractExpiry()
          .call({ from: account })
          .catch((error) => {});
        const contractExpiry = new Date(0);
        contractExpiry.setUTCSeconds(getContractExpiry);
        setGetContractExpiry(isValidDate(contractExpiry) ? formatTxTimestamp(contractExpiry) : formatTxTimestamp(Date.now()));

        //get current price
        const currentPrice = await ClaimContract.methods
          .getAssetPrice()
          .call({ from: account })
          .catch((error) => {});
        setGetAssetPrice(currentPrice);

        //get Bidding End Date
        const getContractBidEnd = await ClaimContract.methods
          .getBidPeriodLimit()
          .call({ from: account })
          .catch((error) => {});
        setGetContractBidEnd(hasContractExpire);
        const BidEnd = new Date(0);
        BidEnd.setUTCSeconds(getContractBidEnd);

        // Set the Bid Ending date in Time format
        setOptions({
          BidEnd,
        });
      };
      getOwner();
    }
  }, [ClaimContract, account, hasBidEnded, claimed]);

  useEffect(() => {
    setBidAmount(1);
  }, [claimed]);

  const modifyBidAmount = (bid) => {
    if (bid === "inc") setBidAmount(+bidAmount + 1);
    else if (bid === "dec" && bidAmount > 0) setBidAmount(+bidAmount - 1);
  };
  return (
    <div className="Bidcard">
      <section className="Bid_Card_main">
        <article className="Card_component">
          <div className="Bid_Card_main">
            <section className="BidTokenPair_images">
              <p style={{ fontSize: 20, color: "#86c440" }}>Pick a side to place a bid</p>
            </section>
            <section>
              <article className="Card_item">
                <h1 className="Card_title">Strike Price</h1>
                <h6 className="Card_content">
                  {isLoading && active ? (
                    <SkeletonTheme color="#333" highlightColor="#888">
                      x
                      <Skeleton width={50} />
                    </SkeletonTheme>
                  ) : (
                    "$" + price
                  )}
                </h6>
              </article>
            </section>
            <section>
              <article className="Card_item">
                <h1 className="Card_title">Current Asset Price</h1>
                <h6 className="Card_content">
                  {isLoading && active ? (
                    <SkeletonTheme color="#333" highlightColor="#888">
                      x
                      <Skeleton width={50} />
                    </SkeletonTheme>
                  ) : (
                    "$" + getAssetPrice
                  )}
                </h6>
              </article>
            </section>
            <section>
              <article className="Card_item">
                <h1 className="Card_title">Option Expiry Date</h1>
                <h6 className="Card_content">
                  {isLoading && active ? (
                    <SkeletonTheme color="#333" highlightColor="#888">
                      x
                      <Skeleton width={50} />
                    </SkeletonTheme>
                  ) : (
                    "" + getContractExpiry
                  )}
                </h6>
              </article>
            </section>
            <section>
              <article className="Card_item">
                <h1 className="Card_title">Bidding Ends in</h1>
                <h6 className="Card_content">
                  {isLoading && active ? (
                    <SkeletonTheme color="#333" highlightColor="#888">
                      x
                      <Skeleton width={50} />
                    </SkeletonTheme>
                  ) : (
                    <CountdownTimer date={options.BidEnd} />
                  )}
                </h6>
              </article>
            </section>
          </div>
          {active ? (
            isLoading ? (
              <SkeletonTheme color="#333" highlightColor="#888">
                <Skeleton height={30} />
              </SkeletonTheme>
            ) : hasContractExpire || hasBidEnded || isPaused ? (
              isPaused ? (
                <button className="Button_button bid-ended">Contract is on paused</button>
              ) : isWinner ? (
                <button className="Button_button bid-claim" onClick={() => onClaimClick()}>
                  Claim
                </button>
              ) : (
                <button className="Button_button bid-ended">{hasContractExpire ? "Bidding Ended" : "Winner Not Announced"}</button>
              )
            ) : (
              <>
                <div className="mb-3 input_text" style={{ display: "flex", alignItems: "center" }}>
                  <div className="dec" onClick={() => modifyBidAmount("dec")}>
                    <Remove />
                  </div>
                  <Form.Check type="number" name="select" placeholder="Enter Bid Amount" value={bidAmount} onChange={(event) => setBidAmount(parseInt(event.target.value))} />
                  <div className="inc" onClick={() => modifyBidAmount("inc")}>
                    <Add />
                  </div>
                </div>
                <div className="Bidfooter-title">
                  <button
                    className="Button_button long_sort_button"
                    onClick={() => {
                      if (DVDBalance < bidAmount) {
                        setDVDBalanceError(true);
                      } else if (bidAmount > 0) onLongClick(bidAmount);
                    }}
                  >
                    Long
                    <TrendingUp />
                  </button>
                  <button
                    className="Button_button long_sort_button short_color"
                    onClick={() => {
                      if (DVDBalance < bidAmount) {
                        setDVDBalanceError(true);
                      } else if (bidAmount > 0) onShortClick(bidAmount);
                    }}
                  >
                    Short
                    <TrendingDown />
                  </button>
                </div>
                <div>{onPauseError && <p className="onpause_error_text"> Contract is on pause</p>}</div>
                <div>{DVDBalanceError && <p className="DVD_Balance_error_text"> Insufficient USDx balance.</p>}</div>
              </>
            )
          ) : (
            <MetamaskButton title="Connect Metamask to bid" />
          )}
        </article>
      </section>
    </div>
  );
};

export default BidCard;
