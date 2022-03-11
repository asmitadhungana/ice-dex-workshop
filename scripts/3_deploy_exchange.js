const hre = require("hardhat");

const fs = require("fs");
const path = require("path");

async function fetchTokenAddress() {
  try {
    var data = fs.readFileSync(path.resolve(__dirname, "../deployedContracts.json"));
  } catch (err) {
    console.log(err);
  }

  var deployedContracts = JSON.parse(data);
  return deployedContracts.TokenAddress;
}

async function addExchangeAddressToFile(exchangeAddress) {
  try {
    var data = fs.readFileSync(path.resolve(__dirname, "../deployedContracts.json"));
  } catch (err) {
    console.log(err);
  }

  var deployedContracts = JSON.parse(data);

  deployedContracts = {
    ...deployedContracts, 
    ExchangeAddress: exchangeAddress
  }

  fs.writeFileSync(path.resolve(__dirname, "../deployedContracts.json"), JSON.stringify(deployedContracts), err => {
    if (err) throw err;
  });
}

async function main() {
  // FETCH THE TOKEN ADDRESS
  const token_address = fetchTokenAddress();

  // DEPLOY THE EXCHANGE CONTRACT
  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy(token_address);

  await exchange.deployed();

  // LOG THE DEPLOYED ADDRESS
  console.log("Exchange deployed to:", exchange.address);

  // QUERY THE SUPPORTED TOKEN-ADDRESS
  console.log("This exchange is for the tokenAddress:", await exchange.tokenAddress());
  
  // ADD EXCHANGE ADDRESS TO THE LIST OF DEPLOYED CONTRACTS
  await addExchangeAddressToFile(exchange.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
