import { users } from "./state.js";
import { calculateLiqAirdrop } from "./liq.js";
import { calculateVeAirdrop } from "./velit.js";
import { calculateTestnetAirdrop } from "./testnet.js";
import fs from 'fs';
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { checksumAddress, encodeAbiParameters, keccak256 as keccak256_viem, parseAbiParameters } from "viem";
async function main() {
    await Promise.all([
        calculateVeAirdrop(),
        calculateLiqAirdrop(),
        calculateTestnetAirdrop(),
    ]);
    const [veAirdrop, liqAirdrop, testnetAirdrop] = users.reduce(([veAmount, liqAmount, testnetAmount], user) => {
        veAmount += user.veAirdropAmount;
        liqAmount += user.liqAirdropAmount;
        testnetAmount += user.testnetAirdropAmount;
        return [veAmount, liqAmount, testnetAmount];
    }, [0n, 0n, 0n]);
    const [airdropRecipients, merkleRecipients] = users
        .sort((a, b) => {
        if (a.address < b.address)
            return -1;
        if (a.address > b.address)
            return 1;
        return 0;
    })
        .reduce(([airdropRecipients, merkleRecipients], user) => {
        if (user.address !== '0xb5087f95643a9a4069471a28d32c569d9bd57fe4' && // ignore BunniHub
            user.address !== '0x9b295791419933c5451a0c503132afb64366cc4e' // Zubdaya hacked address
        ) {
            if (user.totalAirdropAmount > 0n) {
                airdropRecipients.push({
                    address: user.address,
                    veAirdropAmount: user.veAirdropAmount.toString(),
                    testnetAirdropAmount: user.testnetAirdropAmount.toString(),
                    liqAirdropAmount: user.liqAirdropAmount.toString(),
                    totalAirdropAmount: user.totalAirdropAmount.toString()
                });
                merkleRecipients[user.address] = user.totalAirdropAmount.toString();
            }
        }
        return [airdropRecipients, merkleRecipients];
    }, [[], Object.create({})]);
    const jsonData = JSON.stringify(airdropRecipients, null, 2);
    fs.writeFile('airdrop.json', jsonData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
        else {
            console.log('Selected JSON data has been saved.');
        }
    });
    const merkleData = JSON.stringify(merkleRecipients, null, 2);
    fs.writeFile('merkle.json', merkleData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
        else {
            console.log('Selected JSON data has been saved.');
        }
    });
    const recipients = [];
    for (const [address, tokens] of Object.entries(merkleRecipients)) {
        recipients.push({
            address: checksumAddress(address),
            value: tokens
        });
    }
    const merkleTree = new MerkleTree(
    // Generate leafs
    recipients.map(({ address, value }) => generateLeaf(address, value)), 
    // Hashing function
    keccak256, { sortPairs: true });
    // Collect and log merkle root
    const merkleRoot = merkleTree.getHexRoot();
    await fs.writeFileSync(
    // Output to merkle.json
    'merkleTree.json', 
    // Root + full tree
    JSON.stringify({
        root: merkleRoot,
        tree: merkleTree
    }));
}
function generateLeaf(address, value) {
    const singleHash = keccak256_viem(encodeAbiParameters(parseAbiParameters('address, uint256'), [address, BigInt(value)]));
    const doubleHash = keccak256_viem(singleHash);
    return Buffer.from(doubleHash.slice(2), "hex");
}
main();
//# sourceMappingURL=index.js.map