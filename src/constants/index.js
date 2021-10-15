// Toaster messages

const PAUSED_CONTRACT = "Contract has been paused";
const SET_ADMIN = "Admin Set Successfully";
const ANNOUNCE_RESULT = "Result Announce Successfully";
const SHORT_SUCCESS = "Bid Short Successfully";
const SHORT_FAILED = "Bid Short failed";
const LONG_SUCCESS = "Bid Long Successfully";
const LONG_FAILED = "Bid Long Failed";
const CLAIM_FAILED = "Claimed Failed";
const ALREADY_CLAIMED = "Already Claimed";
const CLAIM_SUCCESS = "Claimed Successfully";
const DEPLOY_PINATA_FAILED = "Adding Option to IPFS failed";
const DEPLOY_SUCCESS = "Options deployed Successfully";
const DEPLOY_FAILED = "Option deployment failed";

const OPTIONS = [
  { label: "AAVE", value: "AAVE" },
  { label: "ADA", value: "ADA" },
  { label: "BNB", value: "BNB" },
  { label: "BTC", value: "BTC" },
  { label: "CAKE", value: "CAKE" },
  { label: "DODO", value: "DODO" },
  { label: "DOGE", value: "DOGE" },
  { label: "DOT", value: "DOT" },
  { label: "ETH", value: "ETH" },
  { label: "FIL", value: "FIL" },
  { label: "LINK", value: "LINK" },
  { label: "MATIC", value: "MATIC" },
  { label: "REEF", value: "REEF" },
  { label: "XRP", value: "XRP" },
];

export {
  PAUSED_CONTRACT,
  SET_ADMIN,
  ANNOUNCE_RESULT,
  SHORT_SUCCESS,
  SHORT_FAILED,
  LONG_FAILED,
  LONG_SUCCESS,
  CLAIM_FAILED,
  ALREADY_CLAIMED,
  CLAIM_SUCCESS,
  DEPLOY_PINATA_FAILED,
  DEPLOY_SUCCESS,
  DEPLOY_FAILED,
  OPTIONS,
};
