import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDVDBalance, usePinataOptions } from "../../hooks";
import Spinner from "../../components/Spinner/Spinner";
import CardTableLayout from "../../components/CardTableLayout/cardTableLayout";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Dashboard.css";
import Card from "../../components/Card/Card";
import Banner from "../../components/Banner/Banner";

const cardLayoutSwitchLimit = 6; //CArd Limit after which Carsoule Switch to Table Layout

const Dashboard = () => {
  const [showTable, setShowTable] = useState(false);
  const history = useHistory();
  const { optionList, isLoading } = usePinataOptions(process.env.REACT_APP_ADMIN_WALLET);
  const DVDBalance = useDVDBalance();

  const onCardClick = (id) => {
    history.push(`/options/${id}`);
  };
  useEffect(() => {
    if (optionList.length > cardLayoutSwitchLimit) {
      setShowTable(true);
    }
  }, []);
  return (
    <>
      <Banner DVDBalance={DVDBalance} />
      <div className="optionGrid">
        {isLoading ? (
          <Spinner />
        ) : showTable ? (
          <CardTableLayout cardList={optionList} onCardClick={onCardClick} />
        ) : (
          <div className="carousel-container">
            {/* {console.log(optionList?.map(() => {}))} */}
            {optionList?.map(({ contract, expiry, currency, currencyLogo, id }, idx) => {
              console.log(currency + " " + expiry + " " + id + " " + idx);
              const expiryDate = expiry;
              return <Card id={contract} onCardClick={onCardClick} currency={currency} currencyLogo={currencyLogo} expiry={Number(expiry)} key={idx} type={"carouselformat"} />;
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
