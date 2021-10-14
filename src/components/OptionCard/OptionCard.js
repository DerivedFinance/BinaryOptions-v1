import React, { useEffect, useState, Fragment } from "react";
import { Card } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useDerivedContract } from "../../hooks";
import { formatTxTimestamp, isValidDate } from "../../utils/formatters";
import "./OptionCard.css";
import CountdownTimer from "./countDownTimer";
import SkeletonLoading from "../Loading/skeletonLoading";

const OptionCard = ({
  id,
  currency,
  currencyLogo,
  onCardClick,
  onEnded = undefined,
  type,
  bgGrident,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useWeb3React();
  const [options, setOptions] = useState({
    short: 0,
    long: 0,
    longPercentage: 0,
    shortPercentage: 0,
    strikePrice: 0,
    contractExpiry: new Date(),
  });
  const DerivedContract = useDerivedContract();

  useEffect(() => {
    const getLongs = async () => {
      try {
        setIsLoading(true);
        // Change Font Size if its Carsoule
        if (type === "carouselformat") {
          document.documentElement.style.setProperty(
            "--card-font-size",
            `2rem`
          );
          document.documentElement.style.setProperty(
            "--card-img-margin",
            `2rem`
          );
        } else if (type === "tableformat") {
          document.documentElement.style.setProperty(
            "--card-font-size",
            `1rem`
          );
          document.documentElement.style.setProperty(
            "--card-img-margin",
            `1rem`
          );
        }

        const long = await DerivedContract.methods
          .getLongs()
          .call({ from: account });
        const short = await DerivedContract.methods
          .getShorts()
          .call({ from: account });
        const strikePrice = await DerivedContract.methods
          .getStrikePrice()
          .call({ from: account });

        const epochContractExpiry = await DerivedContract.methods
          .getContractExpiry()
          .call({ from: account });

        const contractExpiry = new Date(0);
        contractExpiry.setUTCSeconds(epochContractExpiry); //Covert Epoch date to standard UTC Date

        const longPer = Number(long) * 100;
        const totalOptions = Number(short) + Number(long);
        const longPercentage = longPer / totalOptions;
        setOptions({
          long: Number(long),
          short: Number(short),
          longPercentage,
          shortPercentage: 100 - longPercentage,
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
    <Fragment>
      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <Card
          className="card-main-wrapper"
          id="main-card-wrapper"
          onClick={() => onCardClick(id)}
          style={{ backgroundImage: bgGrident }}
        >
          <Card.Body>
            <Card.Title className="card-title-wrapper">
              <div className="d-flex align-self-center text-uppercase card-title-header">
                <div className="crypto-image">
                <img
                  src={currencyLogo || "https://gateway.pinata.cloud/ipfs/QmNRYGM4mgbFp83ff7KFXQrieFiNk9zuWTmD1CqiuDAPB8"}
                  alt=""
                />
                </div>
                <p>{currency}</p>
              </div>
              <CountdownTimer date={options.contractExpiry} />
            </Card.Title>

            <div className="card-center">
              <Card.Text>${options.strikePrice}</Card.Text>
              <Card.Text>
                by{" "}
                {isValidDate(options.contractExpiry)
                  ? formatTxTimestamp(options.contractExpiry)
                  : formatTxTimestamp(Date.now())}
              </Card.Text>
            </div>
            <Card.Footer className="card-footer-wrapper">
              <div className="footer-title">
                <p className="long">{options.longPercentage}%</p>
                <p className="short">{options.shortPercentage}%</p>
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
            </Card.Footer>
          </Card.Body>
        </Card>
      )}
    </Fragment>
  );
};

export default OptionCard;
