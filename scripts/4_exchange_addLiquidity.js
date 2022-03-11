const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const hre = require("hardhat");

const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );
  
async function fetchExchangeAddress() {
    try {
      var data = fs.readFileSync(path.resolve(__dirname, "../deployedContracts.json"));
    } catch (err) {
      console.log(err);
    }
  
    var deployedContracts = JSON.parse(data);
    return deployedContracts.ExchangeAddress;
}
  
async function fetchTokenAddress() {
  try {
    var data = fs.readFileSync(path.resolve(__dirname, "../deployedContracts.json"));
  } catch (err) {
    console.log(err);
  }

  var deployedContracts = JSON.parse(data);
  return deployedContracts.TokenAddress;
}

async function main() {
  const exchange_address = fetchExchangeAddress();

  // ATTACH THE EXCHANGE ABI TO A DEPLOYED EXCHANGE ADDRESS
  const exchange = await hre.ethers.getContractAt("Exchange", exchange_address);

  // ADD LIQUIDITY
  const tokenAmount = toWei(20);
  const iczAmount = toWei(2);

  // FETCH THE TOKEN
  const token = await hre.ethers.getContractAt("Token", fetchTokenAddress());
  console.log("Deployer token balance is:", await token.balanceOf(DEPLOYER_ADDRESS));

  // APPROVE THE EXCHANGE CONTRACT
  await token.approve(exchange_address, tokenAmount);
  console.log("Allowance for Exchange contract is:", await token.allowance(DEPLOYER_ADDRESS, exchange_address));

  // CALL THE addLiquidity() FUNCTION FROM THE EXCHANGE CONTRACT
  await exchange.addLiquidity(tokenAmount, { value: iczAmount });
  
  // QUERY THE TOKEN AND ICZ RESERVE BALANCE OF THE EXCHANGE
  console.log("Token reserve in Exchange liquidity pool is:", fromWei(await exchange.getTokenReserve()));
  console.log("ICZ reserve in Exchange liquidity pool is:", fromWei(await exchange.getIczReserve()));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
