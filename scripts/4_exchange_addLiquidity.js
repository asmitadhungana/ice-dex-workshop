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

  // ATTACH THE EXCHANGE ABI TO A DEPLOYED EXCHANGE ADDRESS
  const exchange = await hre.ethers.getContractAt("Exchange", exchangeAddress);

  // ADD LIQUIDITY
  const tokenAmount = toWei(20);
  const iczAmount = toWei(2);

  // FETCH THE TOKEN
  const token = await hre.ethers.getContractAt("Token", tokenAddress);
  console.log("Deployer token balance is:", fromWei(await token.balanceOf(DEPLOYER_ADDRESS)));

  // APPROVE THE EXCHANGE CONTRACT
  await token.approve(exchangeAddress, tokenAmount, { gasLimit: 75000 });
  console.log("Allowance for Exchange contract is:", fromWei(await token.allowance(DEPLOYER_ADDRESS, exchangeAddress)));

  // CALL THE addLiquidity() FUNCTION FROM THE EXCHANGE CONTRACT
  await exchange.addLiquidity(tokenAmount, { value: iczAmount });
  console.log(`Successfully added liquidity of ${fromWei(tokenAmount)} ${await token.name()} and ${fromWei(iczAmount)} ICZ to the Pool`);
  
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
