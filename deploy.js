const startTimestamp = Date.now();
const ethers = require('ethers');
// const config = require('./config.json');
const fs = require('fs-extra');
const dotenv = require('dotenv');

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider({
    url: process.env.COINBASE_RPC_URL,
    user: process.env.COINBASE_USERNAME,
    password: process.env.COINBASE_PASSWORD
})

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log(`Loaded wallet ${wallet.address}`);

let compiled = require(`./build/${process.argv[2]}.json`);

(async() => {
  console.log(`\nDeploying ${process.argv[2]} to ${(await provider.getNetwork()).name}...`);
  let contract = new ethers.ContractFactory(
    compiled.abi,
    compiled.bytecode,
    wallet
  );

  let instance =  await contract.deploy();
  console.log(`deployed at ${instance.address}`)
//   config[`${process.argv[2]}`] = instance.address
  console.log("Waiting for the contract to get mined...")
  await instance.deployed()
  console.log("Contract deployed")
//   fs.outputJsonSync(
//     'config.json',
//     config,
//     {
//       spaces:2,
//       EOL: "\n" 
//     }
//   );

})();