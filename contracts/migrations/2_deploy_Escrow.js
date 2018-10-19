const Escrow = artifacts.require("./Escrow.sol");
const DAI = artifacts.require("./DAI.sol");

// Main Net
// Contract: https://etherscan.io/address/0xfa1909f6fe2120e3aa4a63883776250ba5042b60
// const ARBITRATOR = "0xa7c2662a534a0ae22e8b0f27d6a099e3b3971c6a";
// const DAI_COIN_ADDRESS = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359";

// Ropsten
// Contract: https://ropsten.etherscan.io/address/0x186d2514ab736a41b31b8d1f623de17f0ab8380f
const ARBITRATOR = "0xB06cEF6B14dd249f5a0977F645436cC4f4095325";
const DAI_COIN_ADDRESS = "0xee3ea3cd9afd7cb2c476d44a70fc9ed4cd3ba438";

// Ropsten Deployment
module.exports = (deployer, network, accounts) => {
  deployer.deploy(DAI, {from: accounts[0]}).then(() => {
    return deployer.deploy(Escrow, DAI.address, accounts[8], {from: accounts[0]})
      .then(async () => {
        const tokenAmount = "100" + "0".repeat(18);
        const DAIInstance = await DAI.deployed();
        await DAIInstance.transfer(accounts[1], tokenAmount, {from: accounts[0]});
        await DAIInstance.transfer(accounts[2], tokenAmount, {from: accounts[0]});
        await DAIInstance.transfer(accounts[3], tokenAmount, {from: accounts[0]});
        await DAIInstance.transfer(accounts[4], tokenAmount, {from: accounts[0]});
        return;
      })
  });
};

// Main Net Deployment
// module.exports = (deployer, network, accounts) => {
//   console.log(accounts[0]);
//   deployer.deploy(Escrow, DAI_COIN_ADDRESS, ARBITRATOR, {from: accounts[0]});
// };
