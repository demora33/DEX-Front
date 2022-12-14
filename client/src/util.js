import Web3 from "web3";
import Dex from "./contracts/Dex.json";
import ERC20 from "./contracts/Dai.json";

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!");
      }
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const account = accounts[0];
          console.log("Connected Account", account);
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      } else {
        const provider = new Web3.providers.HttpProvider(
          "http://localhost:9545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });
};

const getContracts = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = Dex.networks[networkId];

  const dex = new web3.eth.Contract(
    Dex.abi,
    deployedNetwork && deployedNetwork.address
  );

  const tokens = await dex.methods.getTokens().call();

  const tokenContracts = tokens.reduce(
    (acc, token) => ({
      ...acc,
      [web3.utils.hexToUtf8(token.symbol)]: new web3.eth.Contract(
        ERC20.abi,
        token.tokenAddress
      ),
    }),
    {}
  );

  return { dex, ...tokenContracts };
};

export { getWeb3, getContracts };
