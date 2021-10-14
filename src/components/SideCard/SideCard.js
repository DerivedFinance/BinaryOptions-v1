import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useOptionContract } from "../../hooks";
import pinataSDK from "@pinata/sdk";

const SideCard = ({
  onCardClick,
  contractExpire,
  currency,
  currencyLogo,
  contract,
  ipfs_pin_hash,
  date_unpinned,
}) => {
  const { account } = useWeb3React();
  const [contractExpiry, setContractExpiry] = useState(false);
  const OptionContract = useOptionContract(contract);
  const pinata = pinataSDK(
    process.env.REACT_APP_PINATA_API_KEY,
    process.env.REACT_APP_PINATA_SECRET_KEY
  );
  useEffect(() => {
    const getLongs = async () => {
      try {
        const epochContractExpiry = await OptionContract.methods
          .getContractExpiry()
          .call({ from: account })
          .catch((err) => {});
        const contractExpiry = new Date(0);
        contractExpiry.setUTCSeconds(epochContractExpiry); //Covert Epoch date to standard UTC Date

        const hasContractExpire = await OptionContract.methods
          .hasContractExpire()
          .call({ from: account })
          .catch((err) => {});
        setContractExpiry(contractExpiry < new Date() || hasContractExpire);
        contractExpire(contract, contractExpiry < new Date() || hasContractExpire);
        if (date_unpinned === null && contractExpiry + 604800 < new Date()) {
          pinata
            .unpin(ipfs_pin_hash)
            .then((result) => {})
            .catch((err) => {});
        }
      } catch (error) {}
    };
    getLongs();
  }, [account]);
  return (
    <>
      {account && contractExpiry && (
        <div className="sidecard">
          <div
            key={contract}
            className="expired_list"
            onClick={() => onCardClick(contract)}
          >
            <img
              width="40"
              height="40"
              src={
                currencyLogo ||
                "https://gateway.pinata.cloud/ipfs/QmNRYGM4mgbFp83ff7KFXQrieFiNk9zuWTmD1CqiuDAPB8"
              }
              alt={currency}
              className="expired_image"
            />
            <div className="expired_currency">{currency}</div>
          </div>
          <div className="tooltip_hover">
            {contract?.length > 10 ? contract.slice(0, 10) + "..." : contract}
          </div>
        </div>
      )}
    </>
  );
};
export default SideCard;
