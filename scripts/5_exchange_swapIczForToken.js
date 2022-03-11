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

async function fetchTokenAddress() {
  try {
    var data = fs.readFileSync(path.resolve(__dirname, "../deployedContracts.json"));
  } catch (err) {
    console.log(err);
  }

  var deployedContracts = JSON.parse(data);
  return deployedContracts.TokenAddress;
}

async function fetchExchangeAddress() {
    try {
      var data = fs.readFileSync(path.resolve(__dirname, "../deployedContracts.json"));
    } catch (err) {
      console.log(err);
    }
  
    var deployedContracts = JSON.parse(data);
    return deployedContracts.ExchangeAddress;
}

async function main() {

  /// ATTACH THE EXCHANGE ABI TO A DEPLOYED EXCHANGE ADDRESS
  const exchange = await hre.ethers.getContractAt("Exchange", fetchExchangeAddress());

  // SWAP AMOUNT
  const iczAmount = 1;

  // QUERY USER-TOKEN BALANCE BEFORE SWAP
  const token = await hre.ethers.getContractAt("Token", fetchTokenAddress());

  console.log("===================================================================");
  console.log("                           ICZ-to-Token-Swap                       ");
  console.log("===================================================================");

  console.log("Deployer token balance BEFORE-SWAP is:", fromWei(await token.balanceOf(DEPLOYER_ADDRESS)), await token.symbol());

  // QUERY THE TOKEN AND ICZ RESERVE BALANCE OF THE EXCHANGE BEFORE SWAP
  console.log(`Token reserve in Exchange liquidity pool BEFORE-SWAP is:  ${fromWei(await exchange.getTokenReserve())}  ${await token.symbol()}`);
  console.log(`ICZ reserve in Exchange liquidity pool BEFORE-SWAP is: ${fromWei(await exchange.getIczReserve())} ICZ`);


  // GET OBTAINABLE TOKEN AMOUNT
  const obtainableTokenAmount = await exchange.getTokenAmount(toWei(iczAmount));
  console.log(`Obtainable Token Amount for swapping ${iczAmount} ICZ is: ${fromWei(obtainableTokenAmount)} ${await token.symbol()}`);

  // =====SWAP ICZ FOR TOKEN ===== //
  // const minTokensToObtain = toWei(obtainableTokenAmount - (0.1 * obtainableTokenAmount));
  const _minTokensToObtain = toWei(0.01);
  await exchange.swapIczForToken(_minTokensToObtain, { value: toWei(iczAmount) });
  console.log(`Congratulations! Your ICZ has been swapped for ${await token.symbol()} successfully!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });