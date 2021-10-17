import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { create } from "ipfs-http-client";

import { pinOptionData } from "./../../utils/storeData";
import Spinner from "../../components/Spinner/Spinner";
import toasterMessage from "../../utils/toasterMessage";
import { DEPLOY_FAILED, DEPLOY_SUCCESS, DEPLOY_PINATA_FAILED, OPTIONS } from "../../constants";

import optionSC from "./../../contracts/option.json";
import "./AddOption.css";
import { BorderAll } from "@material-ui/icons";

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

    // Variable to store the aggregator address
    var aggregator;

    // Check for the corresponding currecny symbol and assign the aggregator address
    switch (currency) {
      case "AAVE":
        aggregator = "0x298619601ebCd58d0b526963Deb2365B485Edc74";
        break;

      case "ADA":
        aggregator = "0x5e66a1775BbC249b5D51C13d29245522582E671C";
        break;

      case "BNB":
        aggregator = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526";
        break;

      case "BTC":
        aggregator = "0x5741306c21795FdCBb9b265Ea0255F499DFe515C";
        break;

      case "CAKE":
        aggregator = "0x81faeDDfeBc2F8Ac524327d70Cf913001732224C";
        break;

      case "DODO":
        aggregator = "0x2939E0089e61C5c9493C2013139885444c73a398";
        break;

      case "DOGE":
        aggregator = "0x963D5e7f285Cc84ed566C486c3c1bC911291be38";
        break;

      case "DOT":
        aggregator = "0xEA8731FD0685DB8AeAde9EcAE90C4fdf1d8164ed";
        break;

      case "ETH":
        aggregator = "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7";
        break;

      case "FIL":
        aggregator = "0x17308A18d4a50377A4E1C37baaD424360025C74D";
        break;

      case "LINK":
        aggregator = "0x1B329402Cb1825C6F30A0d92aB9E2862BE47333f";
        break;

      case "MATIC":
        aggregator = "0x957Eb0316f02ba4a9De3D308742eefd44a3c1719";
        break;

      case "REEF":
        aggregator = "0x902fA2495a8c5E89F7496F91678b8CBb53226D06";
        break;

      case "XRP":
        aggregator = "0x4046332373C24Aed1dC8bAd489A04E187833B28d";
        break;
    }

    const result = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
        arguments: [process.env.REACT_APP_USDXTOKEN, endtime, strikePrice, endtime - 86400 * 3, aggregator, currency],
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
    if (account && account !== process.env.REACT_APP_ADMIN_WALLET) history.push("/");
  });

  const getTwoDigit = (value) => (value > 9 ? value : "0" + value);

  const date = new Date();

  const minDate = date.getFullYear() + "-" + getTwoDigit(date.getMonth() + 1) + "-" + getTwoDigit(date.getDate()) + "T" + getTwoDigit(date.getHours()) + ":" + getTwoDigit(date.getMinutes());

  const addOption = async () => {
    setIsSubmit(true);
    if (form.currency && form.currencyLogo && form.expiry && form.value && account === process.env.REACT_APP_ADMIN_WALLET) {
      setIsLoading(true);
      try {
        const res = await deploy(parseInt(+new Date(form.expiry.replace("T", " ")) / 1000), +form.value, form.currency);

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
      <div className="input_filed" style={{ display: "block", fontSize: 24, color: "#86c440" }}>
        Add Option
      </div>
      <div className="input_filed">
        <div className="input_title">Currency</div>
        <div className="input_text_option">
          <select className="currency-option" name="currency" onChange={(event) => setForm({ ...form, currency: event.target.value })}>
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
        {isSubmit && !form.currency && <div className="addoptionerror">*Invalid value</div>}
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
        {isSubmit && !form.currencyLogo && <div className="addoptionerror">*Invalid value</div>}
      </div>
      <div className="input_filed">
        <div className="input_title">Expiry</div>
        <div className="input_text_option">
          <input type="datetime-local" className="text" min={minDate} value={form.expiry} onChange={(event) => setForm({ ...form, expiry: event.target.value })} style={{ fontSize: 16 }} />
        </div>
        {isSubmit && !form.expiry && <div className="addoptionerror">*Invalid value</div>}
      </div>
      <div className="input_filed">
        <div className="input_title">Strike Price</div>
        <div className="input_text_option">
          <input type="number" className="text" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} />
        </div>
        {isSubmit && !form.value && <div className="addoptionerror">*Invalid value</div>}
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
