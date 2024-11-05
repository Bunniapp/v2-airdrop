import { gql } from "graphql-request";
import { batchSubgraphData } from "./subgraph.js";
import { getUser, getUsers, users } from "./state.js";
import { getPublicClient } from "./viem.js";
import { mainnet } from "viem/chains";
import dotenv from 'dotenv';
dotenv.config();

import BalancerPoolABI from './abi/BalancerPool.json' assert { type: 'json' };
import BalancerVaultABI from './abi/BalancerVault.json' assert { type: 'json' };
import BaseRewardPoolABI from './abi/BaseRewardPool.json' assert { type: 'json' };

import { decodeEventLog, erc20Abi, Log, parseAbiItem, zeroAddress } from "viem";


export async function calculateVeAirdrop(): Promise<void> {
  await Promise.all([
    getVeLitHolders(),
    getLiqLitHolders(),
    getStakedLiqLitHolders(),
    getLiqLitLiquidityProviders(),
  ]);
  await calculateAidropAmounts();
}

async function getVeLitHolders(): Promise<void> {
  const userData = await batchSubgraphData(BUNNI_V1_MAINNET_SUBGRAPH_ENDPOINT, veLitQuery);
  // @ts-ignore
  userData.votingLocks.forEach((_lock) => {
    const user = getUser(_lock.user.address);
    user.veAmount = BigInt(parseFloat(_lock.amount) * 1e18);
    user.veLockEnd = BigInt(_lock.lockEnd);
    return user;
  });
}

async function getLiqLitHolders(): Promise<void> {
  const client = getPublicClient(mainnet);

  await client.getLogs({
    address: '0x03C6F0Ca0363652398abfb08d154F114e61c4Ad8',
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256)'),
    fromBlock: 0n,
    toBlock: 21121993n
  })
  .then(async (logs: Log[]) => {
    logs.forEach((log: Log) => {
      const decodedArgs = decodeEventLog({ 
        abi: erc20Abi,
        data: log.data,
        topics: log['topics']
      });

      const fromAddress = decodedArgs['args']['from'];
      if (fromAddress !== zeroAddress) {
        const fromUser = getUser(fromAddress);
        fromUser.liqLitAmount -= decodedArgs['args']['value']
      }

      const toAddress = decodedArgs['args']['to'];
      if (toAddress !== zeroAddress) {
        const toUser = getUser(toAddress);
        toUser.liqLitAmount += decodedArgs['args']['value']
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
}

async function getStakedLiqLitHolders(): Promise<void> {
  const client = getPublicClient(mainnet);

  // handle Staked events
  await client.getLogs({
    address: '0x7Ea6930a9487ce8d039f7cC89432435E6D5AcB23',
    event: parseAbiItem('event Staked(address indexed, uint256)'),
    fromBlock: 0n,
    toBlock: 21121993n
  })
  .then(async (logs: Log[]) => {
    logs.forEach((log: Log) => {
      
      const decodedArgs = decodeEventLog({ 
        abi: BaseRewardPoolABI,
        data: log.data,
        topics: log['topics']
      });

      const userAddress = decodedArgs['args']['user'];
      if (userAddress !== zeroAddress) {
        const user = getUser(userAddress);
        user.stakedLiqLitAmount += decodedArgs['args']['amount']
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });

  // handle Withdrawn events
  await client.getLogs({
    address: '0x7Ea6930a9487ce8d039f7cC89432435E6D5AcB23',
    event: parseAbiItem('event Withdrawn(address indexed, uint256)'),
    fromBlock: 0n,
    toBlock: 21121993n
  })
  .then(async (logs: Log[]) => {
    logs.forEach((log: Log) => {
      
      const decodedArgs = decodeEventLog({ 
        abi: BaseRewardPoolABI,
        data: log.data,
        topics: log['topics']
      });

      const userAddress = decodedArgs['args']['user'];
      if (userAddress !== zeroAddress) {
        const user = getUser(userAddress);
        user.stakedLiqLitAmount -= decodedArgs['args']['amount']
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
}

async function getLiqLitLiquidityProviders(): Promise<void> {
  const result = await batchSubgraphData(BUNNI_V1_MAINNET_SUBGRAPH_ENDPOINT, liqLitLiquidityProviderQuery);

  // @ts-ignore
  const bunniTokens = result.bunniTokens;
  for (let bunniToken of bunniTokens) {
    if (bunniToken.address === '0x37c80638b02ddd9d487320db1de90e50ec9c4ea3') {
      await getLiquidityProviders_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3(bunniToken);
    }
    if (bunniToken.address === '0xa6ece63a84224213a8a706e33b2073a2373335fa') {
      await getLiquidityProviders_0xa6ece63a84224213a8a706e33b2073a2373335fa(bunniToken);
    }
    if (bunniToken.address === '0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23') {
      await getLiquidityProviders_0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23(bunniToken);
    }
  };
}

async function getLiquidityProviders_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3(bunniToken): Promise<void> {
  bunniToken.positions.forEach((_position) => {
    const user = getUser(_position.user.address);
    const lpBalance = parseFloat(_position.balance) + parseFloat(_position.gaugeBalance);
    user.balance_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3 += BigInt(Math.round(lpBalance * 1e18));
  });

  // handle Liquis depositors
  const client = getPublicClient(mainnet);
  await client.getLogs({
    address: '0x5738a5798e33Ca43D32680165D5Be4cf18c5bdD7',
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256)'),
    fromBlock: 0n,
    toBlock: 21121993n
  })
  .then(async (logs: Log[]) => {
    logs.forEach((log: Log) => {
      const decodedArgs = decodeEventLog({ 
        abi: erc20Abi,
        data: log.data,
        topics: log['topics']
      });

      const fromAddress = decodedArgs['args']['from'];
      if (fromAddress !== zeroAddress) {
        const fromUser = getUser(fromAddress);
        const lpBalance = decodedArgs['args']['value'];
        fromUser.balance_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3 -= lpBalance;
      }

      const toAddress = decodedArgs['args']['to'];
      if (toAddress !== zeroAddress) {
        const toUser = getUser(toAddress);
        const lpBalance = decodedArgs['args']['value'];
        toUser.balance_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3 += lpBalance;
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });

  const liqLitPerLP = BigInt(Math.round(parseFloat(bunniToken.amount0PerShare) * 1e18));
  getUsers().forEach((user) => {
    if (user.balance_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3 > 0n) {
      user.liqLitAmount += user.balance_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3 * liqLitPerLP / 1_000_000_000_000_000_000n;
    }
  });
}

async function getLiquidityProviders_0xa6ece63a84224213a8a706e33b2073a2373335fa(bunniToken): Promise<void> {
  bunniToken.positions.forEach((_position) => {
    const user = getUser(_position.user.address);
    const lpBalance = parseFloat(_position.balance) + parseFloat(_position.gaugeBalance);
    user.balance_0xa6ece63a84224213a8a706e33b2073a2373335fa += BigInt(Math.round(lpBalance * 1e18));
  });

  // handle Liquis depositors
  const client = getPublicClient(mainnet);
  await client.getLogs({
    address: '0x2A1Ea0Bf7D8775eE1559B17D979a235A345EB8e3',
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256)'),
    fromBlock: 0n,
    toBlock: 21121993n
  })
  .then(async (logs: Log[]) => {
    logs.forEach((log: Log) => {
      const decodedArgs = decodeEventLog({ 
        abi: erc20Abi,
        data: log.data,
        topics: log['topics']
      });

      const fromAddress = decodedArgs['args']['from'];
      if (fromAddress !== zeroAddress) {
        const fromUser = getUser(fromAddress);
        const lpBalance = decodedArgs['args']['value'];
        fromUser.balance_0xa6ece63a84224213a8a706e33b2073a2373335fa -= lpBalance;
      }

      const toAddress = decodedArgs['args']['to'];
      if (toAddress !== zeroAddress) {
        const toUser = getUser(toAddress);
        const lpBalance = decodedArgs['args']['value'];
        toUser.balance_0xa6ece63a84224213a8a706e33b2073a2373335fa += lpBalance;
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });

  const liqLitPerLP = BigInt(Math.round(parseFloat(bunniToken.amount0PerShare) * 1e18));
  users.forEach((user) => {
    if (user.balance_0xa6ece63a84224213a8a706e33b2073a2373335fa > 0n) {
      user.liqLitAmount += user.balance_0xa6ece63a84224213a8a706e33b2073a2373335fa * liqLitPerLP / 1_000_000_000_000_000_000n;
    }
  });
}

async function getLiquidityProviders_0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23(bunniToken): Promise<void> {
  bunniToken.positions.forEach((_position) => {
    const user = getUser(_position.user.address);
    const lpBalance = parseFloat(_position.balance) + parseFloat(_position.gaugeBalance);
    user.balance_0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23 += BigInt(Math.round(lpBalance * 1e18));
  });

  const liqLitPerLP = BigInt(Math.round(parseFloat(bunniToken.amount0PerShare) * 1e18));
  users.forEach((user) => {
    if (user.balance_0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23 > 0n) {
      user.liqLitAmount += user.balance_0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23 * liqLitPerLP / 1_000_000_000_000_000_000n;
    }
  });
}

async function getLitPerBalancerPoolToken(): Promise<bigint> {
  const client = getPublicClient(mainnet);

  const [totalSupplyResult, poolTokensResult] = await Promise.all([
    client.readContract({
      address: '0x9232a548DD9E81BaC65500b5e0d918F8Ba93675C',
      abi: BalancerPoolABI,
      functionName: 'totalSupply',
      blockNumber: 21121993
    }),
    client.readContract({
      address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      abi: BalancerVaultABI,
      functionName: 'getPoolTokens',
      args: ['0x9232a548dd9e81bac65500b5e0d918f8ba93675c000200000000000000000423'],
      blockNumber: 21121993
    })
  ]);

  const litBalance = poolTokensResult[1][1];
  const wethPerBalancePerPoolToken = poolTokensResult[1][0] * 1000000000000000000n / totalSupplyResult;
  const litPerBalancePerPoolToken = litBalance * 1000000000000000000n / totalSupplyResult;
  return litPerBalancePerPoolToken;
}

async function calculateAidropAmounts(): Promise<void> {
  const ignoredAddresses = [
    '0x37aeB332D6E57112f1BFE36923a7ee670Ee9278b', // Liquis voter proxy
    '0x7Ea6930a9487ce8d039f7cC89432435E6D5AcB23', // liqLIT staking contract,
    '0x276be30882ea365a5854739f93d10c916175e81c', // liqLIT/BAL-20WTH-80LIT pool
    '0x1f45642d1ce76f22bbc31670f40811158e98d804', // liqLIT/WETH pool
  ];

  ignoredAddresses.forEach((address) => {
    const user = getUser(address);
    user.veAmount = 0n;
    user.liqLitAmount = 0n;
    user.stakedLiqLitAmount = 0n;
  });

  const litPerBPT = await getLitPerBalancerPoolToken();
  users.forEach((user) => {
    // handle veLIT balance    
    if (user.veAmount !== 0n && user.veLockEnd !== 0n) {
      const veAirdropAmount = user.veAmount * (user.veLockEnd - 1730816279n) / 126144000n * litPerBPT * 5n / 4n / 1000000000000000000n;
      user.veAirdropAmount = veAirdropAmount
      user.totalAirdropAmount += veAirdropAmount;
    }
    
    // handle liqLIT balance
    if (user.liqLitAmount !== 0n || user.stakedLiqLitAmount !== 0n) {
      const voterProxy = getUser('0x37aeB332D6E57112f1BFE36923a7ee670Ee9278b');
      const liqLitAirdropAmount = (user.liqLitAmount + user.stakedLiqLitAmount) * (voterProxy.veLockEnd - 1730816279n) / 126144000n * litPerBPT * 5n / 4n / 1000000000000000000n;
      user.veAirdropAmount += liqLitAirdropAmount
      user.totalAirdropAmount += liqLitAirdropAmount;
    }
  });
}

const BUNNI_V1_MAINNET_SUBGRAPH_ENDPOINT: string = `https://gateway.thegraph.com/api/${process.env.GRAPH_SUBGRAPH_KEY}/subgraphs/id/6EcVGBGhW8U6B9nd9uT1n5iDRMtH2evoJeaY5BXBCniM`

const veLitQuery: string = gql`
  query veLitQuery (
    $skip: Int = 0,
    $first: Int = 1000
  ) {
    votingLocks (
      orderBy: amount,
      orderDirection: desc,
      where: {
        lockEnd_gt: 1730816279
      }
    ) {
      amount
      balance
      decay
      lastUpdate
      lockEnd
      user {
        address
      }
    }
  }
`;

const liqLitLiquidityProviderQuery: string = gql`
  query LiqLiquidityProviderQuery (
    $skip: Int = 0,
    $first: Int = 1000
  ) {
    bunniTokens (
      where: {
        or: [
          {address: "0x37c80638b02ddd9d487320db1de90e50ec9c4ea3"},
          {address: "0xa6ece63a84224213a8a706e33b2073a2373335fa"},
          {address: "0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23"},
        ],
      }
      block: {
        number: 21121993
      }
    ) {
      address
      amount0PerShare
      amount1PerShare
      totalSupply
      reserve0
      reserve1
      positions (
        where: {
          or: [
            { balance_gt: 0 },
            { gaugeBalance_gt: 0}
          ]
        }
      ) {
        user {
          address
        }
        balance
        gaugeBalance 
      }
    }
  }
`;