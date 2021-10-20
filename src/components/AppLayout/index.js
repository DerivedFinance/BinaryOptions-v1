import React, { Fragment } from "react";
import { Navbar, Nav, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import UserInfo from "../UserInfo/UserInfo";
import MetamaskButton from "../MetamaskButton/MetamaskButton";
import { useDVDBalance, useEthBalance } from "../../hooks";
import { truncateBalance } from "../../utils/formatters";

import DerivedLogo from "../../assets/images/Derived_Logo_Green_Dark_BG.svg";
import "./AppLayout.css";
import Sidebar from "../Sidebar/Sidebar";

const NavWithDetails = ({ title, value, ...props }) => {
  const mediaQuery = window.matchMedia("(max-width: 900px)");

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {value}
    </Tooltip>
  );
  return (
    <div className="user-info dvd-nav" {...props}>
      <div className="user-info-wrapper">
        <div className="user-address-wrapper">
          <div className="user-address">{title}:</div>
          <div className="">
            {value.length > 5 && !mediaQuery.matches ? (
              <OverlayTrigger key={`bottom`} placement={`bottom`} overlay={renderTooltip(value)}>
                <div>{value.length > 5 ? truncateBalance(value.toString()) : value}</div>
              </OverlayTrigger>
            ) : (
              <div>{value.length > 5 ? truncateBalance(value.toString()) : value}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppLayout = ({ children }) => {
  const { account } = useWeb3React();
  const DVDBalance = useDVDBalance();
  const ether = useEthBalance();
  return (
    <Fragment>
      <div className="appLayout">
        <Navbar collapseOnSelect expand="lg" variant="dark" className="nav-layout">
          <Link to="/">
            <img src={DerivedLogo} alt="logo" className="navLogo" />
          </Link>

          <Nav>
            {account ? (
              <Fragment>
                <NavWithDetails title="BNB" value={ether} className="eth-nav" /> <NavWithDetails title="USDx" value={DVDBalance.toString()} className="eth-nav" />
              </Fragment>
            ) : null}
            {account ? <UserInfo address={account} ether={ether} DVDBalance={DVDBalance} /> : <MetamaskButton />}
          </Nav>
        </Navbar>
        <Sidebar />
        <div className="dashboardWrapper">
          <div className="main-wrapper">
            <div>{children}</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AppLayout;
