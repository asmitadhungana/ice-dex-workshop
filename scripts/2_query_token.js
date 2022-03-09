const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const hre = require("hardhat");

const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
const USER_ADDRESS = process.env.USER_ADDRESS;

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
  // ATTACH THE CONTRACT ABI TO THE CONTRACT ADDRESS
  const my_token = await hre.ethers.getContractAt("Token", fetchTokenAddress());

  // QEURY THE NAME, SYMBOL AND TOTAL-SUPPPLY OF THE TOKEN
  console.log("Name of the Token is:", await my_token.name());
  console.log("Symbol of the Token is:",await my_token.symbol());
  console.log("Total Supply of the Token is:", await my_token.totalSupply());

  // QUERY THE DEPLOYER-TOKEN-BALANCE
  console.log("Deployer token balance is:", await my_token.balanceOf(DEPLOYER_ADDRESS));

  // TRANSFER SOME TOKENS FROM DEPLOYER TO THE USER
  await my_token.transfer(USER_ADDRESS, 1000);

  // QUERY THE USER-TOKEN-BALANCE
  console.log("User token balance is:", await my_token.balanceOf(USER_ADDRESS));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
