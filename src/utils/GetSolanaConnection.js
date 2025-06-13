const { Connection, clusterApiUrl } = require("@solana/web3.js");
const { SOLANA_DEV_RPC } = require("../common/SystemConfiguration");

const getDevConnection = () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  return connection;
};

const getTestConnection = () => {
  const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
  return connection;
};

const getMainConnection = () => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  return connection;
};

module.exports = { getDevConnection, getTestConnection, getMainConnection };
