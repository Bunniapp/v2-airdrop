import { gql } from "graphql-request";
import { batchSubgraphData } from "./subgraph.js";
import { getUser, users } from "./state.js";
import { Deploy, Deposit, Swap, Withdraw } from "./class.js";
import { getCompletedQuests } from "./quest.js";
import dotenv from 'dotenv';
dotenv.config();
export async function calculateTestnetAirdrop() {
    await getTestnetUsers();
    calculateAirdropAmounts();
}
async function getTestnetUsers() {
    const userData = await batchSubgraphData(BUNNI_V2_SEPOLIA_SUBGRAPH_ENDPOINT, query);
    // @ts-ignore
    userData.users.forEach((_user) => {
        const user = getUser(_user.id);
        user.transactions = _user.transactions.map((_tx) => {
            let tx = null;
            if (_tx.type === 'DEPLOY_POOL') {
                tx = new Deploy(parseInt(_tx.timestamp));
                tx.amount0 = parseInt(_tx.amount0);
                tx.amount1 = parseInt(_tx.amount1);
                tx.pool = _tx.pool.id;
                tx.currency0 = _tx.pool.currency0.id;
                tx.currency1 = _tx.pool.currency1.id;
                tx.vault0 = _tx.pool.bunniToken.vault0 ? _tx.pool.bunniToken.vault0.id : null;
                tx.vault1 = _tx.pool.bunniToken.vault1 ? _tx.pool.bunniToken.vault1.id : null;
            }
            if (_tx.type === 'DEPOSIT_LIQUIDITY') {
                tx = new Deposit(parseInt(_tx.timestamp));
                tx.amount0 = parseInt(_tx.amount0);
                tx.amount1 = parseInt(_tx.amount1);
                tx.pool = _tx.pool.id;
                tx.currency0 = _tx.pool.currency0.id;
                tx.currency1 = _tx.pool.currency1.id;
                tx.vault0 = _tx.pool.bunniToken.vault0 ? _tx.pool.bunniToken.vault0.id : null;
                tx.vault1 = _tx.pool.bunniToken.vault1 ? _tx.pool.bunniToken.vault1.id : null;
            }
            if (_tx.type === 'WITHDRAW_LIQUIDITY') {
                tx = new Withdraw(parseInt(_tx.timestamp));
                tx.amount0 = parseInt(_tx.amount0);
                tx.amount1 = parseInt(_tx.amount1);
                tx.pool = _tx.pool.id;
                tx.currency0 = _tx.pool.currency0.id;
                tx.currency1 = _tx.pool.currency1.id;
                tx.vault0 = _tx.pool.bunniToken.vault0 ? _tx.pool.bunniToken.vault0.id : null;
                tx.vault1 = _tx.pool.bunniToken.vault1 ? _tx.pool.bunniToken.vault1.id : null;
            }
            if (_tx.type === 'SWAP') {
                tx = new Swap(parseInt(_tx.timestamp));
                tx.amount0 = parseInt(_tx.amount0);
                tx.amount1 = parseInt(_tx.amount1);
                tx.pool = _tx.pool.id;
                tx.currency0 = _tx.pool.currency0.id;
                tx.currency1 = _tx.pool.currency1.id;
                tx.vault0 = _tx.pool.bunniToken.vault0 ? _tx.pool.bunniToken.vault0.id : null;
                tx.vault1 = _tx.pool.bunniToken.vault1 ? _tx.pool.bunniToken.vault1.id : null;
            }
            return tx;
        });
        user.questCompletions = getCompletedQuests(user.transactions);
    });
}
function calculateAirdropAmounts() {
    users.forEach((user) => {
        let userAridropAmount = 0n;
        if (user.questCompletions >= 5 && user.questCompletions <= 7) {
            userAridropAmount = 100n * 1000000000000000000n * BigInt(user.questCompletions);
        }
        else if (user.questCompletions >= 8 && user.questCompletions <= 10) {
            userAridropAmount = 200n * 1000000000000000000n * BigInt(user.questCompletions);
        }
        else if (user.questCompletions >= 11) {
            userAridropAmount = 600n * 1000000000000000000n * BigInt(user.questCompletions);
        }
        user.testnetAirdropAmount = userAridropAmount;
        user.totalAirdropAmount += userAridropAmount;
    });
}
const BUNNI_V2_SEPOLIA_SUBGRAPH_ENDPOINT = `https://subgraph.satsuma-prod.com/${process.env.ALCHEMY_SUBGRAPH_KEY}/bacon-labs/bunni-v2-sepolia/version/v0.3.9/api`;
const query = gql `
  query UserQuery (
    $skip: Int = 0,
    $first: Int = 1000
  ) {
    users (
      skip: $skip,
      first: $first,
    ) {
      id
      transactions (
        first: 1000,
        where:{
          timestamp_gte:1721606400,
          timestamp_lte:1730816279,
        }
      ) {
        timestamp
        type
        amount0
        amount1
        pool {
          id
          bunniToken {
            id
            vault0 {
              id
            }
            vault1 {
              id
            }
          }
          currency0 {
            id
          }
          currency1 {
            id
          }
        }
      }
    }

  }
`;
//# sourceMappingURL=testnet.js.map