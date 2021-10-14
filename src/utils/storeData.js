import pinataSDK from "@pinata/sdk";

const pinata = pinataSDK(
  process.env.REACT_APP_PINATA_API_KEY,
  process.env.REACT_APP_PINATA_SECRET_KEY
);

const wallet = "0x0CcA67351d8384800836B937Ad61C4Ac853b744C";

const body = {
  wallet: "0x0CcA67351d8384800836B937Ad61C4Ac853b744C",
  options: [
    {
      id: "4",
      contract: "0x06E44342AD6a7fff64D051538F88364d4A5D71c3",
      currency: "bnb",
      currencyLogo:
        "https://gateway.pinata.cloud/ipfs/QmNRYGM4mgbFp83ff7KFXQrieFiNk9zuWTmD1CqiuDAPB8",
      expiry: 1625891776,
      value: 250,
    },
    {
      id: "10",
      contract: "0xe9a06e631fbd3ab85829f801dc5341c70e2d3803",
      currency: "bnc",
      currencyLogo:
        "https://gateway.pinata.cloud/ipfs/QmNRYGM4mgbFp83ff7KFXQrieFiNk9zuWTmD1CqiuDAPB8",
      expiry: 1635315033,
      value: 250,
    },
  ],
};

const storeOptionData = async (_wallet = wallet, _body = body) => {
  const options = {
    pinataMetadata: {
      name: "options",
    },
  };
  pinata
    .pinList()
    .then((result) => {
      Object.keys(result.rows).forEach(async (element) => {
        let entry = result.rows[element];
        if (entry.date_unpinned === null) {
          pinata
            .unpin(entry.ipfs_pin_hash)
            .then((result) => {})
            .catch((err) => {});
        }
        await pinOptionData(_body, options);
      });
    })
    .catch((error) => {});
};

const pinOptionData = async (body, options) => {
  try {
    pinata
      .pinJSONToIPFS(body, options)
      .then((result) => {})
      .catch((error) => {});
  } catch (error) {
  }
};

const pinActivityData = async (body, activities) => {
  try {
    await pinata
      .pinJSONToIPFS(body, activities)
      .then((result) => {})
      .catch((error) => {});
  } catch (error) {
  }
};

export {storeOptionData,pinActivityData,pinOptionData};