const fs = require('fs');
const hdWalletProvider = require('truffle-hdwallet-provider')

const secrets = JSON.parse(fs.readFileSync('.secrets').toString().trim());


module.exports = {
  newtorks:{
    ropsten: {
      provider: () => 
         new hdWalletProvider(
           secrets.seed,
           `https://ropsten.infura.io/v3/${secrets.projectId}`
         )
    }
  }
};