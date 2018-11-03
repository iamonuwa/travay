# Escrow Smart Contract

## Build Contracts
```
cd contracts

rm -rf build

truffle migrate --network <development, ropsten, etc>

```

## Run tests

```
truffle test --network development
```

## Withdraw DAI from Contract in Console

```
truffle console --network ropsten

Escrow.deployed().then(ins => esc = ins)

web3.eth.getAccounts((err, accounts) => arb = accounts[8])

esc.withdrawDAI(arb, 2000000000000000000,{from:arb})
```

## Transfer DAI to an address in Console

```
truffle console --network ropsten

web3.eth.getAccounts((err, accounts) => account1 = accounts[0])

DAI.deployed().then(ins => daiInstance = ins)

daiInstance.transfer('<account>', <amount>000000000000000000, {from: account1})
```
## Deployed Contract

## v1

Main Net
Contract: https://etherscan.io/address/0xfa1909f6fe2120e3aa4a63883776250ba5042b60
ARBITRATOR = "0xa7c2662a534a0ae22e8b0f27d6a099e3b3971c6a";
DAI_COIN_ADDRESS = "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359";

Ropsten
Contract: https://ropsten.etherscan.io/address/0x186d2514ab736a41b31b8d1f623de17f0ab8380f
ARBITRATOR = "0xB06cEF6B14dd249f5a0977F645436cC4f4095325";
DAI_COIN_ADDRESS = "0xee3ea3cd9afd7cb2c476d44a70fc9ed4cd3ba438";

## v2

## Workflow

All are blockchain functions, listed in order unless otherwise noted.

1. createJob
2. cancelJob (at any time)
3. claimJob
```
4. uploadProofOfWork (can be executed at any time and not on network)
```
5. markJobComplete
6. setEvaluator (set at the time of job creation)
7. evaluateJobAsCompletedSucessfully
```
8. evaluateJobAsCompletedUnsucessfully (can be executed at any time and not on network also a WIP)
```
9. payoutJob
10. claimPayout
11. makeTipEscrow (at any time)
12. sponsorJob (at any time)
