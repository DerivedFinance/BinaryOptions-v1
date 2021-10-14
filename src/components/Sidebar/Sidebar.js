import React, { useState } from "react";
import { useHistory } from "react-router";
import { usePinataOptions } from "../../hooks";
import SideCard from "../SideCard/SideCard";
import "./Sidebar.css";
const Sidebar = () => {
  const { optionList } = usePinataOptions(process.env.REACT_APP_ADMIN_WALLET);
  const [expiredList, setExpiredList] = useState(false);
  const history = useHistory();
  const onCardClick = (id) => {
    history.push(`/options/${id}`);
  };
  const contractExpire = (contract, status) => {
    if (status === true && expiredList === false) setExpiredList(true);
  };
  return (
    <div className="Sidebar">
      <div className="Sidebar_list">
        {expiredList && <div className="expired_header">Expired</div>}
        {optionList?.map(
          ({ contract, expiry, currency, currencyLogo, id, ipfs_pin_hash, date_unpinned }, idx) => {
            return (
              <SideCard
                contract={contract}
                onCardClick={onCardClick}
                contractExpire={contractExpire}
                currency={currency}
                currencyLogo={currencyLogo}
                expiry={Number(expiry)}
                key={idx}
                ipfs_pin_hash={ipfs_pin_hash}
                date_unpinned={date_unpinned}
              />
            );
          }
        )}
      </div>
    </div>
  );
};
export default Sidebar;
