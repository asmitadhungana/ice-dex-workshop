# ICE-DEX Workshop
Welcome to the public repository of ICE-DEX workshop!</br>
In this workshop, you'll learn how to create and deploy your custom ERC20 Token and a dedicated Exchange for it in the ICE-testnet.</br>
Please go through the given tasks and complete them in a sequential order in order to do so...

## Task 1: Add the contracts
Add the two contracts to the /contracts directory 
- Token.sol
- Exchange.sol

## Task 2: Add your accounts for deploying
Create a new file called ***.env*** in the root directory and perform *one* of the following tasks as per your preference:
* Use the provided accounts pre-funded with ICZ (testnet currency of ICE: Frost Network) to deploy and interact with the contracts in Frost:
    * Copy the contents of [.env.example](.env.example) file
    * Paste it in your newly created .env file and save it

* Use your personal metamask wallet pre-funded with ICZ to deploy and interact with the contracts in Frost:
    * Copy the contents of [.env.example](.env.example) file
    * Paste it in your newly created .env file
    * Replace the `DEPLOYER_PRIVATE_KEY` with the private key of the account you want to use
    * Replace the `DEPLOYER_ADDRESS` with the address of the related account

## Task 3: Run the scripts 
There are 5 scripts provided inside the [scripts](scripts) directory, run them consecutively in your terminal using the command:

```shell
npx hardhat run scripts/<file_name>
```

- [1_deploy_token.js](scripts/1_deploy_token.js)
- [2_query_token.js](scripts/2_query_token.js)
- [3_deploy_exchange.js](scripts/3_deploy_exchange.js)
- [4_exchange_addLiquidity.js](scripts/4_exchange_addLiquidity.js)
- [5_exchange_make_swaps.js](scripts/5_exchange_make_swaps.js)

<details>
    <summary> Additional Hardhat Commands</summary>
    <p>`npx hardhat accounts`</p>
    <p>`npx hardhat compile`</p>
    <p>`npx hardhat clean`</p>
    <p>`npx hardhat test`</p>
    <p>`npx hardhat node`</p>
    <p>`npx hardhat help`</p>
</details>

### Thanks for participating!