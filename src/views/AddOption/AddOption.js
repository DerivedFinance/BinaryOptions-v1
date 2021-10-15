import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { create } from "ipfs-http-client";

import { pinOptionData } from "./../../utils/storeData";
import Spinner from "../../components/Spinner/Spinner";
import toasterMessage from "../../utils/toasterMessage";
import {
  DEPLOY_FAILED,
  DEPLOY_SUCCESS,
  DEPLOY_PINATA_FAILED,
  OPTIONS,
} from "../../constants";

import optionSC from "./../../contracts/option.json";
import "./AddOption.css";

// Deploy contract
const deploy = async (endtime, strikePrice, currency) => {
  try {
    const Web3 = require("web3");
    window.ethereum.enable();
    const bytecode = optionSC.bytecode;
    const abi = optionSC.abi;
    const { ethereum } = window;
    const web3 = new Web3(ethereum);
    const accounts = await web3.eth.getAccounts();

    const result = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
        arguments: [
          process.env.REACT_APP_USDXTOKEN,
          endtime,
          strikePrice,
          endtime,
          process.env.REACT_APP_AGGREGATOR,
          currency,
        ],
      })
      .send({ gas: web3.utils.toHex(10000000), from: accounts[0] });
    return result.options.address;
  } catch (error) {
    toasterMessage(error.message || DEPLOY_FAILED, { error: true });
  }
};

const AddOption = () => {
  const { account } = useWeb3React();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [form, setForm] = useState({
    currency: "",
    currencyLogo: "",
    expiry: "",
    value: "",
  });

  const history = useHistory();

  useEffect(() => {
    if (account && account !== process.env.REACT_APP_ADMIN_WALLET)
      history.push("/");
  });

  const getTwoDigit = (value) => (value > 9 ? value : "0" + value);

  const date = new Date();

  const minDate =
    date.getFullYear() +
    "-" +
    getTwoDigit(date.getMonth() + 1) +
    "-" +
    getTwoDigit(date.getDate()) +
    "T" +
    getTwoDigit(date.getHours()) +
    ":" +
    getTwoDigit(date.getMinutes());

  const addOption = async () => {
    setIsSubmit(true);
    if (
      form.currency &&
      form.currencyLogo &&
      form.expiry &&
      form.value &&
      account === process.env.REACT_APP_ADMIN_WALLET
    ) {
      setIsLoading(true);
      try {
        const res = await deploy(
          parseInt(+new Date(form.expiry.replace("T", " ")) / 1000),
          +form.value,
          form.currency
        );

        pinOptionData(
          {
            id: res,
            contract: res,
            currency: form.currency,
            currencyLogo: form.currencyLogo,
            expiry: +new Date(form.expiry.replace("T", " ")),
            value: +form.value,
          },
          {
            pinataMetadata: {
              name: "options",
              keyvalues: {
                isOptions: "true",
              },
            },
          }
        )
          .then((res) => {
            setIsLoading(false);
            setForm({
              currency: "",
              currencyLogo: "",
              expiry: "",
              value: "",
            });
            setIsSubmit(false);
            toasterMessage(DEPLOY_SUCCESS);
          })
          .catch((err) => {
            setIsSubmit(false);
            toasterMessage(err.message || DEPLOY_PINATA_FAILED);
          });
      } catch (error) {
        setIsSubmit(false);
        setIsLoading(false);
        toasterMessage(error.message || DEPLOY_FAILED);
      }
    }
  };

  return (
    <div className="addoption">
      {isLoading && <Spinner />}
      <div
        className="input_filed"
        style={{ display: "block", fontSize: 24, color: "#86c440" }}
      >
        Add Option
      </div>
      <div className="input_filed">
        <div className="input_title">Currency</div>
        <div className="input_text_option">
          <select
            className="currency-option"
            name="currency"
            onChange={(event) =>
              setForm({ ...form, currency: event.target.value })
            }
          >
            <option>Select Currency</option>
            {OPTIONS.map(({ label, value }) => {
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
        {isSubmit && !form.currency && (
          <div className="addoptionerror">*Invalid value</div>
        )}
      </div>
      <div className="input_filed">
        <div className="input_title">Currency Logo</div>
        <div className="input_text_option">
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={async (event) => {
              if (event.target.files.length > 0) {
                const client = new create("https://ipfs.infura.io:5001/api/v0");
                const added = await client.add(event.target.files[0]);
                const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                console.log("added:" + added);
                console.log(url);
                if (url)
                  setForm({
                    ...form,
                    currencyLogo: url,
                  });
                else
                  setForm({
                    ...form,
                    currencyLogo: null,
                  });
              } else {
                setForm({
                  ...form,
                  currencyLogo: null,
                });
              }
            }}
            style={{ width: "100%", fontSize: 16 }}
          />
        </div>
        {isSubmit && !form.currencyLogo && (
          <div className="addoptionerror">*Invalid value</div>
        )}
      </div>
      <div className="input_filed">
        <div className="input_title">Expiry</div>
        <div className="input_text_option">
          <input
            type="datetime-local"
            className="text"
            min={minDate}
            value={form.expiry}
            onChange={(event) =>
              setForm({ ...form, expiry: event.target.value })
            }
            style={{ fontSize: 16 }}
          />
        </div>
        {isSubmit && !form.expiry && (
          <div className="addoptionerror">*Invalid value</div>
        )}
      </div>
      <div className="input_filed">
        <div className="input_title">Strike Price</div>
        <div className="input_text_option">
          <input
            type="number"
            className="text"
            value={form.value}
            onChange={(event) =>
              setForm({ ...form, value: event.target.value })
            }
          />
        </div>
        {isSubmit && !form.value && (
          <div className="addoptionerror">*Invalid value</div>
        )}
      </div>
      <div className="input_filed" style={{ display: "block" }}>
        <button className="Add_Option_Button" onClick={() => addOption()}>
          Add Option
        </button>
      </div>
    </div>
  );
};
export default AddOption;
