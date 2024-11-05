
import { users } from "./state.js";
import { calculateLiqAirdrop } from "./liq.js";
import { calculateVeAirdrop } from "./velit.js";
import { calculateTestnetAirdrop } from "./testnet.js";
import fs from 'fs';

async function main(): Promise<void> {

  await Promise.all([
    calculateVeAirdrop(),
    calculateLiqAirdrop(),
    calculateTestnetAirdrop(),
  ])

  const [veAirdrop, liqAirdrop, testnetAirdrop] = users.reduce(([veAmount, liqAmount, testnetAmount], user) => {
    veAmount += user.veAirdropAmount;
    liqAmount += user.liqAirdropAmount;
    testnetAmount += user.testnetAirdropAmount;
    return [veAmount, liqAmount, testnetAmount];
  }, [0n, 0n, 0n]);

  const airdropRecipients = users
    .sort((a, b) => {
      if (a.address < b.address) return -1
      if (a.address > b.address) return 1;
      return 0;
    })
    .reduce((airdropRecipients, user) => {
    if (user.address !== '0xb5087f95643a9a4069471a28d32c569d9bd57fe4') { // ignore BunniHub
      if (user.totalAirdropAmount > 0n) {
        airdropRecipients.push({
          address: user.address,
          veAirdropAmount: user.veAirdropAmount.toString(),
          testnetAirdropAmount: user.testnetAirdropAmount.toString(),
          liqAirdropAmount: user.liqAirdropAmount.toString(),
          totalAirdropAmount: user.totalAirdropAmount.toString()
        });
      }
    }
    return airdropRecipients;
  }, []);

  const jsonData = JSON.stringify(airdropRecipients, null, 2);
  fs.writeFile('airdrop.json', jsonData, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Selected JSON data has been saved.');
    }
  });
}

main();