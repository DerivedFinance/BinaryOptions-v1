import { useWeb3React } from "@web3-react/core";
import React from "react";
import "./banner.css";

const Banner = () => {
  const { account } = useWeb3React();
  return (
    <div className="component">
      <section className="main">
        <header>
          <h1 className="heading">On-chain exposure to any asset class</h1>
          <section className="encourage">
            Trade cryptocurrencies options (long and short).
          </section>
          {!account && (
            <section className="encourage">
              Please connect to the appropriate ERC20 network for Data.
            </section>
          )}
        </header>
      </section>
    </div>
  );
};
export default Banner;
