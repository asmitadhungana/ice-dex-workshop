const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const hre = require("hardhat");

const deployedContracts = require("../deployedContracts.json");
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;

const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

async function main() {
  const tokenAddress = deployedContracts.TokenAddress;
  const exchangeAddress = deployedContracts.ExchangeAddress;

  /// ATTACH THE EXCHANGE ABI TO A DEPLOYED EXCHANGE ADDRESS
  const exchange = await hre.ethers.getContractAt("Exchange", exchangeAddress);

  // SWAP AMOUNT
  const iczAmount = 1;

  // QUERY USER-TOKEN BALANCE BEFORE SWAP
  const token = await hre.ethers.getContractAt("Token", tokenAddress);

  console.log("===================================================================");
  console.log("                           ICZ-to-Token-Swap                       ");
  console.log("===================================================================");

  console.log("Deployer token balance BEFORE-SWAP is:", fromWei(await token.balanceOf(DEPLOYER_ADDRESS)), await token.symbol());

  // QUERY THE TOKEN AND ICZ RESERVE BALANCE OF THE EXCHANGE BEFORE SWAP
  const tokenReserve = await exchange.getTokenReserve();
  const iczReserve = await exchange.getIczReserve();


  // GET OBTAINABLE TOKEN AMOUNT
  const obtainableTokenAmount = await exchange.getAmount(toWei(iczAmount), iczReserve, tokenReserve);
  console.log(`Obtainable Token Amount for swapping ${iczAmount} ICZ is: ${fromWei(obtainableTokenAmount)} ${await token.symbol()}`);

  // =====SWAP ICZ FOR TOKEN ===== //
  await exchange.swapIczForToken( { value: toWei(iczAmount) } );
  console.log(`Congratulations! Your ICZ has been swapped for ${await token.symbol()} successfully!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
