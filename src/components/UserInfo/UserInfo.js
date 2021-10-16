import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import { Button, Form } from "react-bootstrap";
import { Tooltip } from "ui-neumorphism";
import Modal from "react-modal";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";

import { useOptionContract, useIsPause } from "../../hooks";
import { truncateAddress } from "../../utils/formatters";
import { SUPPORTED_CHAINS } from "../../utils/connectors";
import Spinner from "./../../components/Spinner/Spinner";
import { PAUSED_CONTRACT, SET_ADMIN, ANNOUNCE_RESULT } from "../../constants";
import toasterMessage from "../../utils/toasterMessage";

import walletIcon from "../../assets/images/wallet.svg";
import sortDown from "../../assets/images/sort-down.svg";
import sortUp from "../../assets/images/sort-up.svg";

import "./UserInfo.css";
import "ui-neumorphism/dist/index.css";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    padding: "50px",
    transform: "translate(-50%, -50%)",
  },
};

const NOT_ADMIN_ERROR = "Only admin can call this function";
const RESULT_ANNOUNCE = "Result Already Announced";
const Option_Not_Expired = "Option Not Expired";

const UserInfo = ({ address, ether, DVDBalance }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [pauseModal, setPauseModal] = useState(false);
  const [formValue, setFormValue] = useState(null);
  const [error, setError] = useState(false);
  const [copiedText, setCopied] = useState(false);
  const [isOperation, setIsOperation] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { deactivate, chainId, account } = useWeb3React();
  const history = useHistory();
  const contractAddress = location.pathname.split("/")[2] || "";

  const isPause = useIsPause(contractAddress);
  const optionContract = useOptionContract(contractAddress);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const onLogoutClick = () => {
    localStorage.setItem("shouldEagerConnect", false);
    deactivate();
    history.push("/");
  };

  useEffect(() => {
    // necessary to display the tooltip after copy
    setTimeout(() => {
      setCopied(false);
    }, 500);
  }, [copiedText]);

  useEffect(() => {
    if (process.env.REACT_APP_ADMIN_WALLET === account) {
      setIsAdmin(true);
    }
  }, [account]);
  const shouldDisplayAdminFunctions = () => location.pathname.includes("/options");

  const onSetAdminClick = async (value) => {
    setIsOperation(true);
    setAdminModal(false);
    optionContract.methods
      .setAdmin(value === "true")
      .estimateGas({ from: account })
      .then((gasLimit) => {
        optionContract.methods
          .setAdmin(value === "true")
          .send({ from: account, gasLimit })
          .then((result) => {
            setIsOperation(false);
            toasterMessage(SET_ADMIN);
          })
          .catch((error) => {
            setError(NOT_ADMIN_ERROR);
            setIsOperation(false);
          });
      })
      .catch((error) => {
        setError(NOT_ADMIN_ERROR);
        setIsOperation(false);
      });
  };
  const onResultAnnounceClick = async (value) => {
    setIsOperation(true);
    const epochContractExpiry = await optionContract.methods
      .getContractExpiry()
      .call({ from: account })
      .catch((err) => {});
    const isAdminEnabled = await optionContract.methods
      .isAdminEnabled()
      .call({ from: account })
      .catch((err) => {});
    const contractExpiry = new Date(0);
    contractExpiry.setUTCSeconds(epochContractExpiry);
    if (contractExpiry < new Date() || isAdminEnabled) {
      const hasContractExpire = await optionContract.methods
        .hasContractExpire()
        .call({ from: account })
        .catch((err) => {});
      if (!hasContractExpire) {
        optionContract.methods
          .announceResult()
          .estimateGas({ from: account })
          .then((gasLimit) => {
            optionContract.methods
              .announceResult()
              .send({ from: account, gasLimit })
              .then((result) => {
                setIsOperation(false);
                toasterMessage(ANNOUNCE_RESULT);
              })
              .catch((error) => {
                setError(NOT_ADMIN_ERROR);
                setIsOperation(false);
              });
          })
          .catch((error) => {
            setError(NOT_ADMIN_ERROR);
            setIsOperation(false);
          });
      } else {
        setError(RESULT_ANNOUNCE);
        setIsOperation(false);
      }
    } else {
      setError(Option_Not_Expired);
      setIsOperation(false);
    }
  };
  const { copy } = useCopyAddress(address);

  const onPauseClick = async (value) => {
    setPauseModal(false);
    setIsOperation(true);
    optionContract.methods
      .setPause(value === "true")
      .estimateGas({ from: account })
      .then((gasLimit) => {
        optionContract.methods
          .setPause(value === "true")
          .send({ from: account, gasLimit })
          .then((result) => {
            setIsOperation(false);
            toasterMessage(PAUSED_CONTRACT);
          })
          .catch((error) => {
            setIsOperation(false);
            setError(NOT_ADMIN_ERROR);
          });
      })
      .catch((error) => {
        setIsOperation(false);
        setError(NOT_ADMIN_ERROR);
      });
  };

  return (
    <>
      {isOperation && <Spinner />}

      <div className="user-info user-wallet" style={{ marginRight: 10 }}>
        <div className="user-info-wrapper" onClick={toggleDropdown}>
          <div className="user-address-wrapper">
            <div className="wallet-status" />
            <div className="user-address">{truncateAddress(address)}</div>
            <div className="wallet-network">{SUPPORTED_CHAINS[chainId] || "UNSUPPORTED"}</div>
          </div>
          <div className="dropdown-wallet-icon">
            <img src={walletIcon} alt="wallet-icon" />
            {isDropdownOpen ? <img src={sortUp} alt="sort-up" /> : <img src={sortDown} alt="sort-down" />}
          </div>
        </div>
        {isDropdownOpen && (
          <div className="user-info-extended-wrapper">
            <div className="user-info-extended">
              <div className="user-info-wallet">
                <div className="wallet-details">Wallet Details</div>
              </div>
              <div className="user-info-wallet-address">
                <div>
                  <span>ACCOUNT</span>
                </div>
                <div
                  onClick={() => {
                    setCopied(true);
                    copy();
                  }}
                  className="copyaddress"
                >
                  <Tooltip top visible={copiedText ? true : false} content={<p className="tooltipcontent">Copied!</p>}>
                    <span className="copyIcon">
                      <FileCopyOutlinedIcon />
                    </span>
                  </Tooltip>
                  <span className="address">{`${address.substring(0, 10).trim()}...`}</span>
                </div>
              </div>
              {isAdmin && (
                <div className="user-info-wallet-address">
                  <div className="wallet-button" onClick={() => history.push("/add-option")}>
                    Add Option
                  </div>
                </div>
              )}
              {shouldDisplayAdminFunctions() && (
                <div className="user-info-wallet-address">
                  <div className="admin-function-title">
                    <span>Admin Functions</span>
                  </div>

                  <div className="wallet-button margin-top-10" onClick={() => setAdminModal(true)}>
                    Set Admin
                  </div>
                  <div className="wallet-button margin-top-10" onClick={() => onResultAnnounceClick(true)}>
                    Announce Result
                  </div>
                  <div
                    className="wallet-button margin-top-10"
                    onClick={() => setPauseModal(true)}
                    style={{ color: isPause ? "red" : "green" }}
                  >
                    Pause
                  </div>
                </div>
              )}
              <div className="user-wallet-balance">
                <div className="eth-balance">
                  <div className="eth-text balance-text">ETH : </div>
                  <div className="eth-value value">{ether}</div>
                </div>
                <div className="dvd-balance balance-text">
                  <div className="dvd-text">USDx : </div>
                  <div className="dvd-value value">{DVDBalance}</div>
                </div>
              </div>
              <div className="user-info-wallet">
                <div className="wallet-button" onClick={onLogoutClick}>
                  Logout
                </div>
              </div>
            </div>
          </div>
        )}
        <Modal isOpen={adminModal} onRequestClose={() => setAdminModal(false)} style={customStyles}>
          <h1> Select value </h1>
          <Form>
            <div className="mb-3">
              <Form.Check
                className="mb-3"
                type="radio"
                name="select"
                value={true}
                label="True"
                onChange={(event) => setFormValue({ ...formValue, admin: event.target.value })}
              />
              <Form.Check
                className="mb-3"
                type="radio"
                name="select"
                value={false}
                label="False"
                onChange={(event) => setFormValue({ ...formValue, admin: event.target.value })}
              />
              <Button onClick={() => onSetAdminClick(formValue.admin)}>Set Admin</Button>
            </div>
          </Form>
        </Modal>

        <Modal isOpen={pauseModal} onRequestClose={() => setPauseModal(false)} style={customStyles}>
          <h1> Select value </h1>
          <Form>
            <div className="mb-3">
              <Form.Check
                className="mb-3"
                type="radio"
                name="select"
                value={true}
                label="True"
                onChange={(event) => setFormValue({ ...formValue, pause: event.target.value })}
              />
              <Form.Check
                className="mb-3"
                type="radio"
                name="select"
                value={false}
                label="False"
                onChange={(event) => setFormValue({ ...formValue, pause: event.target.value })}
              />
              <Button onClick={() => onPauseClick(formValue.pause)}>Pause</Button>
            </div>
          </Form>
        </Modal>

        <Modal isOpen={error} onRequestClose={() => setError(null)} style={customStyles}>
          <div className="mb-2">
            <div className="row mt-4 text-center ml-auto mr-auto wrong-network">{error || "Something went wrong"}</div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default UserInfo;
const useCopyAddress = (address) => {
  const [copied, setCopied] = useState(false);
  const reset = () => setCopied(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return { copy, copied, reset };
};
