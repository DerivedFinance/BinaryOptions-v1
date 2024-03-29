import React, { useState, useEffect, useRef } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";

import { injected } from "../../utils/connectors";
import { useEagerConnect, useInactiveListener } from "../../hooks";

import metamaskLogo from "../../assets/images/metamask.png";
import "./MetamaskButton.css";

const ONBOARD_TEXT = "Click to install MetaMask!";
const CONNECT_TEXT = "Connect Metamask";

const MetamaskButton = ({ title = undefined }) => {
  const [metamaskButtonText, setMetamaskButtonText] = useState(ONBOARD_TEXT);
  const [activatingConnector, setActivatingConnector] = useState();

  const { account, error, active, activate, connector } = useWeb3React();
  const onboarding = useRef();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // For Metamask OnBoarding
  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (account && account.length > 0) {
        onboarding.current.stopOnboarding();
      } else {
        setMetamaskButtonText(CONNECT_TEXT);
      }
    }
  }, [account]);

  useEffect(() => {
    if (account && active && !error) {
      // history.push("/dashboard");
    }
  }, [account, active, error]);

  const onConnectWithMetamaskClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      setActivatingConnector(injected);
      localStorage.setItem("shouldEagerConnect", true);
      activate(injected);
    } else {
      onboarding.current.startOnboarding();
    }
  };

  return (
    <div className="loginCard" onClick={onConnectWithMetamaskClick}>
      <p>{!!title ? <span>{title}</span> : metamaskButtonText}</p>
      <div>
        <img src={metamaskLogo} alt="logo" />
      </div>
    </div>
  );
};

export default MetamaskButton;
