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
  const tokenAmount = 10;

  // QUERY DEPLOYER-TOKEN BALANCE BEFORE SWAP
  const token = await hre.ethers.getContractAt("Token", tokenAddress);
  console.log("Deployer token balance BEFORE-SWAP is:", fromWei(await token.balanceOf(DEPLOYER_ADDRESS)), await token.symbol());
  console.log("Deployer ICZ balance BEFORE-SWAP is:", fromWei(await ethers.provider.getBalance(DEPLOYER_ADDRESS)), "ICZ");

  // QUERY THE TOKEN AND ICZ RESERVE BALANCE OF THE EXCHANGE BEFORE SWAP
  const tokenReserve = await exchange.getTokenReserve();
  const iczReserve = await exchange.getIczReserve();

  // GET OBTAINABLE TOKEN AMOUNT
  const obtainableIczAmount = await exchange.getAmount(toWei(tokenAmount), tokenReserve, iczReserve);
  console.log(`Obtainable Icz Amount for swapping ${tokenAmount} ICZ is: ${fromWei(obtainableIczAmount)} ICZ`);

  // =====SWAP TOKEN FOR ICZ ===== //

  // APPROVE THE EXCHANGE CONTRACT
  await token.approve(exchangeAddress, toWei(tokenAmount), { gasLimit: 50000 });

  // MAKE THE SWAP
  await exchange.swapTokenForIcz(toWei(tokenAmount));
  console.log(`Congratulations! Your ICZ has been swapped for ${await token.symbol()} successfully!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
