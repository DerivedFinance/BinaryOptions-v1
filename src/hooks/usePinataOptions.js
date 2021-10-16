import { useEffect, useState } from "react";
import pinataSDK from "@pinata/sdk";

import axiosMain from "../http/axios/axios_main";

const usePinataOptions = (wallet) => {
  const [data, setData] = useState({
    isLoading: true,
    error: false,
    optionList: [],
  });
  const [options, setOptions] = useState([]);
  const pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET_KEY);
  const metadataFilter = {
    name: "options",
    keyvalues: {
      isOptions: {
        value: "true",
        op: "eq",
      },
    },
  };
  useEffect(() => {
    const getPinList = async () => {
      const pinList = await pinata.pinList({
        pageLimit: 20,
        pageOffset: 0,
        metadata: metadataFilter,
      });
      Object.keys(pinList.rows).forEach((element) => {
        const entry = pinList.rows[element];
        if (entry.date_unpinned === null) {
          return axiosMain
            .get("https://ipfs.io/ipfs/" + entry.ipfs_pin_hash)
            .then((response) => {
              response.data.ipfs_pin_hash = entry.ipfs_pin_hash;
              response.data.date_unpinned = entry.date_unpinned;
              setOptions(options.push(response.data));
            })
            .catch((error) => {
              setData({ error, isLoading: false });
            });
        }
      });
      setData({ error: false, optionList: options, isLoading: false });
    };
    getPinList();
  }, []);

  return data;
};

export default usePinataOptions;
