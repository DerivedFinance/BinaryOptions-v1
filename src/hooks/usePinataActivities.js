import { useEffect, useState } from "react";
import pinataSDK from "@pinata/sdk";

import axiosMain from "../http/axios/axios_main";

const usePinataActivities = (wallet,contractAddress) => {
  const [data, setData] = useState({
    result: [],
  });
  const pinata = pinataSDK(
    process.env.REACT_APP_PINATA_API_KEY,
    process.env.REACT_APP_PINATA_SECRET_KEY
  );
  const metadataFilter = {
    name: "activity",
    keyvalues: {
      wallet: {
        value : wallet,
        op: 'eq'
      },
      isActive: {
        value : "true",
        op : 'eq'
      },
      options: {
        value : contractAddress,
        op : 'eq'
      }
    }
  };
  useEffect(() => {
    const getPinList = async () => {
      const pinList = await pinata.pinList({
        pageLimit: 999,
        pageOffset: 0,
        metadata:metadataFilter
      });
      const activityData = [];
      Object.keys(pinList.rows).forEach(async(element) => {
        const entry = pinList.rows[element];
        if (entry.metadata.name === "activity") {
          return axiosMain
            .get("https://ipfs.io/ipfs/" + entry.ipfs_pin_hash)
            .then((response) => {
              if (response.data.wallet !== wallet) {
                return;
              }
              activityData.push(response.data);
              setData({ result: activityData });
            })
            .catch((error) => {});
        }
      });
    };
    wallet && getPinList();
  }, [contractAddress,wallet]);
  return data;
};

export default usePinataActivities;