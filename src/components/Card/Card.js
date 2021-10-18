import React, { useEffect, useState } from "react";
import "./Card.css";
import { formatTxTimestamp, isValidDate } from "../../utils/formatters";

import { useWeb3React } from "@web3-react/core";
import { useOptionContract } from "../../hooks";
import CountdownTimer from "../OptionCard/countDownTimer";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const Card = ({ id, onCardClick, currency, currencyLogo, onEnded = undefined, type }) => {
  const { account } = useWeb3React();
  const [options, setOptions] = useState({
    short: 0,
    long: 0,
    longPercentage: 0,
    shortPercentage: 0,
    strikePrice: 0,
    contractExpiry: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [contractExpiry, setContractExpiry] = useState(false);
  const OptionContract = useOptionContract(id);

  useEffect(() => {
    const getLongs = async () => {
      setIsLoading(true);
      try {
        const long = await OptionContract.methods.getLongs().call({ from: account });
        const short = await OptionContract.methods.getShorts().call({ from: account });
        const strikePrice = await OptionContract.methods.getStrikePrice().call({ from: account });

        const epochContractExpiry = await OptionContract.methods.getContractExpiry().call({ from: account });

        const hasContractExpire = await OptionContract.methods
          .hasContractExpire()
          .call({ from: account })
          .catch((err) => {});
        setContractExpiry(hasContractExpire);

        const contractExpiry = new Date(0);
        contractExpiry.setUTCSeconds(epochContractExpiry); //Covert Epoch date to standard UTC Date

        const longPer = Number(long) * 100;
        const totalOptions = Number(short) + Number(long);
        const longPercentage = longPer / totalOptions;
        setOptions({
          long: Number(long),
          short: Number(short),
          longPercentage: totalOptions > 0 ? longPercentage : 0,
          shortPercentage: totalOptions > 0 ? 100 - longPercentage : 0,
          strikePrice,
          contractExpiry,
        });
        setIsLoading(false);
        return { long, short };
      } catch (error) {
        setIsLoading(false);
      }
    };

    getLongs();
  }, []);
  return (
    <>
      {!contractExpiry && options.contractExpiry > new Date() ? (
        <div className="Card" onClick={() => onCardClick(id)}>
          <section className="Card_main">
            <article className="StakeItemCard_component">
              <div className="StakeItemCard_main">
                <section className="TokenPair_images">
                  <div className="TokenPair_fill bg-bg">
                    <img width="50" height="50" src={currencyLogo || "https://gateway.pinata.cloud/ipfs/QmNRYGM4mgbFp83ff7KFXQrieFiNk9zuWTmD1CqiuDAPB8"} alt="" style={{ borderRadius: "50%" }} />
                  </div>
                </section>
                <header className="StakeItemCard_header">
                  <h1 className="StakeItemCard_heading">
                    {isLoading ? (
                      <SkeletonTheme color="#333" highlightColor="#888">
                        <Skeleton width={50} />
                      </SkeletonTheme>
                    ) : (
                      currency
                    )}
                  </h1>
                </header>
                <section>
                  <article className="StakeItemCard_item">
                    <h1 className="StakeItemCard_title">Time Remaining</h1>
                    <h6 className="StakeItemCard_content">
                      {isLoading ? (
                        <SkeletonTheme color="#333" highlightColor="#888">
                          <Skeleton width={120} />
                        </SkeletonTheme>
                      ) : (
                        <CountdownTimer date={options.contractExpiry} />
                      )}
                    </h6>
                  </article>
                  <article className="StakeItemCard_item">
                    <h1 className="StakeItemCard_title">Expiry Date</h1>
                    <h6 className="StakeItemCard_content">
                      {isLoading ? (
                        <SkeletonTheme color="#333" highlightColor="#888">
                          <Skeleton width={150} />
                        </SkeletonTheme>
                      ) : (
                        "" + (isValidDate(options.contractExpiry) ? formatTxTimestamp(options.contractExpiry) : formatTxTimestamp(Date.now()))
                      )}
                    </h6>
                  </article>
                  <article className="StakeItemCard_item">
                    <h1 className="StakeItemCard_title">Strike Price</h1>
                    <h6 className="StakeItemCard_content">
                      {isLoading ? (
                        <SkeletonTheme color="#333" highlightColor="#888">
                          <Skeleton width={100} />
                        </SkeletonTheme>
                      ) : (
                        options.strikePrice + "$"
                      )}
                    </h6>
                  </article>
                </section>
              </div>
              <div className="footer-title">
                <p className="long">
                  {isLoading ? (
                    <SkeletonTheme color="#333" highlightColor="#888">
                      <Skeleton width={50} />
                    </SkeletonTheme>
                  ) : (
                    options.longPercentage.toFixed(2).toString() + "%"
                  )}
                </p>
                <p className="short">
                  {isLoading ? (
                    <SkeletonTheme color="#333" highlightColor="#888">
                      <Skeleton width={50} />
                    </SkeletonTheme>
                  ) : (
                    options.shortPercentage.toFixed(2).toString() + "%"
                  )}
                </p>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={options.shortPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{
                    width: `${options.longPercentage}%`,
                  }}
                />
              </div>
            </article>
          </section>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Card;
