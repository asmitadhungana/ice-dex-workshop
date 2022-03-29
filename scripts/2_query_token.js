const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const hre = require("hardhat");

const deployedContracts = require("../deployedContracts.json");
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
const USER_ADDRESS = process.env.USER_ADDRESS;

const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

async function main() {

  const tokenAddress = deployedContracts.TokenAddress;
  // ATTACH THE CONTRACT ABI TO THE CONTRACT ADDRESS
  const token = await hre.ethers.getContractAt("Token", tokenAddress);

  // QEURY THE NAME, SYMBOL AND TOTAL-SUPPPLY OF THE TOKEN
  console.log("Name of the Token is:", await token.name());
  console.log("Symbol of the Token is:",await token.symbol());
  console.log("Total Supply of the Token is:", fromWei(await token.totalSupply()));

  // QUERY THE DEPLOYER-TOKEN-BALANCE
  console.log("Deployer token balance is:", fromWei(await token.balanceOf(DEPLOYER_ADDRESS)));

  // TRANSFER SOME TOKENS FROM DEPLOYER TO THE USER
  const transferAmount = 1;
  await token.transfer(USER_ADDRESS, toWei(transferAmount));

  // QUERY THE USER-TOKEN-BALANCE
  console.log("User token balance is:", fromWei(await token.balanceOf(USER_ADDRESS)));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
