const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function addTokenAddressToFile(tokenAddress) {
  try {
    var data = fs.readFileSync(path.resolve(__dirname, "../deployedContracts.json"));
  } catch (err) {
    console.log(err);
  }

  var deployedContracts = JSON.parse(data);

  deployedContracts = {
    ...deployedContracts, 
    TokenAddress: tokenAddress
  }

  fs.writeFileSync(path.resolve(__dirname, "../deployedContracts.json"), JSON.stringify(deployedContracts), err => {
    if (err) throw err;
  });
}

async function main() {
  // DEPLOY THE TOKEN CONTRACT
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy("MyToken", "MTKN", 1000000);

  await token.deployed();
  
  // LOG THE DEPLOYED TOKEN ADDRESS
  console.log("Token deployed to:", token.address);

  // ADD THE DEPLOYED TOKEN ADDRESS TO A JSON FILE
  await addTokenAddressToFile(token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
