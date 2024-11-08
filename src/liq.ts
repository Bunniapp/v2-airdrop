import { decodeEventLog, erc20Abi, Log, parseAbiItem, zeroAddress } from "viem";
import { mainnet } from "viem/chains";
import { getPublicClient } from "./viem.js";
import { getUser, users } from "./state.js";
import dotenv from 'dotenv';
dotenv.config();

import vlLIQABI from './abi/vlLIQ.json' assert { type: 'json' };
import LiqVestedEscrow from './abi/LiqVestedEscrow.json' assert { type: 'json' };
import { gql } from "graphql-request";
import { batchSubgraphData } from "./subgraph.js";


export async function calculateLiqAirdrop(): Promise<void> {
  await Promise.all([
    getLiqHolders(),
    getLockedLiqHolders(),
    getLiqLiquidityProviders(),
  ]);

  await blacklistLiqHolders();
  calculateAirdropAmounts();
  teamAndVotersVestingAdjustments();
  incubatorAdjustments();
}

async function getLiqHolders(): Promise<void> {
  const client = getPublicClient(mainnet);

  await client.getLogs({
    address: '0xD82fd4D6D62f89A1E50b1db69AD19932314aa408',
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
        fromUser.liqBalance -= decodedArgs['args']['value']
      }

      const toAddress = decodedArgs['args']['to'];
      if (toAddress !== zeroAddress) {
        const toUser = getUser(toAddress);
        toUser.liqBalance += decodedArgs['args']['value']
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
}

async function getLockedLiqHolders(): Promise<void> {
  const client = getPublicClient(mainnet);

  // handle Staked events
  await client.getLogs({
    address: '0x748A0F458B9E71061ca0aC543B984473F203E1CB',
    event: parseAbiItem('event Staked(address indexed, uint256, uint256)'),
    fromBlock: 0n,
    toBlock: 21121993n
  })
  .then(async (logs: Log[]) => {
    logs.forEach((log: Log) => {
      
      const decodedArgs = decodeEventLog({ 
        abi: vlLIQABI,
        data: log.data,
        topics: log['topics']
      });

      const userAddress = decodedArgs['args']['_user'];
      if (userAddress !== zeroAddress) {
        const user = getUser(userAddress);
        user.liqLocked += decodedArgs['args']['_lockedAmount']
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });

  // handle Withdrawn events
  await client.getLogs({
    address: '0x748A0F458B9E71061ca0aC543B984473F203E1CB',
    event: parseAbiItem('event Withdrawn(address indexed, uint256, uint256, bool)'),
    fromBlock: 0n,
    toBlock: 21121993n
  })
  .then(async (logs: Log[]) => {
    logs.forEach((log: Log) => {
      
      const decodedArgs = decodeEventLog({ 
        abi: vlLIQABI,
        data: log.data,
        topics: log['topics']
      });

      const userAddress = decodedArgs['args']['_user'];
      if (userAddress !== zeroAddress) {
        const user = getUser(userAddress);
        user.liqLocked -= decodedArgs['args']['_amount']
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });
}

async function getLiqLiquidityProviders(): Promise<void> {
  const result = await batchSubgraphData(BUNNI_V1_MAINNET_SUBGRAPH_ENDPOINT, liqLiquidityProviderQuery);
  
  // @ts-ignore
  const bunniToken = result.bunniToken;
  bunniToken.positions.forEach((_position) => {
    const user = getUser(_position.user.address);
    const lpBalance = parseFloat(_position.balance) + parseFloat(_position.gaugeBalance);
    user.liqLPBalance += BigInt(Math.round(lpBalance * 1e18));
  });


  // handle Liquis depositors
  const client = getPublicClient(mainnet);
  await client.getLogs({
    address: '0x123f9dE6cBeF24E5e112E4F2dA345A1240C32a58',
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
        fromUser.liqLPBalance -= lpBalance;
      }

      const toAddress = decodedArgs['args']['to'];
      if (toAddress !== zeroAddress) {
        const toUser = getUser(toAddress);
        const lpBalance = decodedArgs['args']['value'];
        toUser.liqLPBalance += lpBalance;
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
  });

  const liqPerLP = BigInt(Math.round(parseFloat(bunniToken.amount1PerShare) * 1e18));
  users.forEach((user) => {
    if (user.liqLPBalance > 0n) {
      user.liqBalance += user.liqLPBalance * liqPerLP / 1_000_000_000_000_000_000n;
    }
  });
}

async function blacklistLiqHolders(): Promise<void> {
  const blacklistedAddresses: string[] = [
    '0x748A0F458B9E71061ca0aC543B984473F203E1CB', // vlLIQ (handled separately)
    '0x5958390c53B07aF60Aae34eb11D453388Ee849EC', // Uniswap Pool (handled separately)
    '0x37aeB332D6E57112f1BFE36923a7ee670Ee9278b', // Liquis Voter Proxy (handled separately)
    // add blacklisted LIQ holders here (from Liquis)
    '0xf97964749b52c55d64E971571E1370b2618B718f', // "Partners"
    '0x545210fAc9CE6c9104FBFbF2ED429cC222234670', // "ExtraPartners"
    '0x4c715F7cE87f4C09C438EdabF357657623031F70', // "ThirdPartners"
    '0xae566F666617f7C788cC47AC51CcC3E43Ae5CF9d', // "FourthPartners"
    '0x5ECaEd31Db3E1a20529B503DE75b917E44F7617E', // "FifthPartners"
  ];

  blacklistedAddresses.forEach((address) => {
    const user = getUser(address);
    user.liqBalance = 0n;
  });

  const remainingVestedAmount = await getPublicClient(mainnet).readContract({
    address: '0xae566F666617f7C788cC47AC51CcC3E43Ae5CF9d',
    abi: LiqVestedEscrow,
    functionName: 'remaining',
    args: ['0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B'],
    blockNumber: 21121993
  });

  const inverseFinance = getUser('0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B');
  inverseFinance.liqBalance += remainingVestedAmount;
}

function teamAndVotersVestingAdjustments(): void {
  const teamAndVotersVesting = getUser('0x2F48cB0DA01Ba75e321C870fA77F19f285C69693');

  const adjustments = [
    {address: '0x9958A330F640Af224f03dd9218A51208F77c3CFc', percent: 0.06784599765491105},
    {address: '0xBe48c91215eA411eF648f93829cD5aF6E5f48498', percent: 0.0678462425279771},
    {address: '0x297Eca4d5a103ce0941119b9Cb056aBa3DCc8A71', percent: 0.11290598654757447},
    {address: '0x00AD7539ae2163D3Bd71Bf74635B838e2FC422a3', percent: 0.06074689574987217},
    {address: '0x70115b724f7e187aa73504d96125d1b84720e1ec', percent: 0.03209459624885973},
    {address: '0xfe9A318e1d7EEE138359c137195EA2Bee9fA5200', percent: 0.12963837702340136},
    {address: '0x13900D21774402731959Bc2Ec6D8166c0E86B87c', percent: 0.06781208279790962},
    {address: '0x8F68e0CFd779125b984BBE15229a7872A6187A68', percent: 0.0678451406006539},
    {address: '0x9595b576c42708FE012aFc5d017d4100323B06F1', percent: 0.1559861803693604},
    {address: '0xf78Ef3831f42F36402a7c17436B8A32C3Ee7ded1', percent: 0.000052770047710430954},
    {address: '0xF6Ee1A630BC3eCd8C3fB11520d5952031D7b4C24', percent: 0.002042482460074523},
    {address: '0xDda8901508211dfd3a2A912fEb0b913a6558c113', percent: 0.0012444426162749444},
    {address: '0xde6EA9A2992df0DFa3Ca5Cf09F9f7c2592930342', percent: 0.0020685613929656856},
    {address: '0xAD0f62D1841529EA7442de3f967A42A8410a48dA', percent: 0.0009422698121656294},
    {address: '0x34c9c2E48F43DacE5192002c0d1C3C40EdF463Bd', percent: 0.013618345464243066},
    {address: '0x5592cB82f5B11A4E42B1275A973E6B712194e239', percent: 0.011944396286095463},
    {address: '0x9b295791419933c5451a0C503132AfB64366Cc4e', percent: 0.00042473154592889435},
    {address: '0xAfD5f60aA8eb4F488eAA0eF98c1C5B0645D9A0A0', percent: 0.010718563988937507},
    {address: '0x770569f85346B971114e11E4Bb5F7aC776673469', percent: 0.00006954382178011486},
    {address: '0x1bfD64aB61EACf714B2Aa37347057203f3AcA71f', percent: 0.006860473544383733},
    {address: '0xCa398e17D838F26A7e39eFC31d67FAe20118272b', percent: 0.008825821131633927},
    {address: '0x20907A020A4A85669F2940D645e94C5B6490d1ad', percent: 0.004038806431955652},
    {address: '0x8E64Cb7ba3FA9e92Ac22C8e7D8e07f758c60B27A', percent: 0.000001224363119196858},
    {address: '0x009d13E9bEC94Bf16791098CE4E5C168D27A9f07', percent: 0.00019712245260950572},
    {address: '0x13d64c4063785695733f9c04a5cB0c03789CA5e6', percent: 0.00006733996860776921},
    {address: '0x6dB995701fc2e6EF646A801322C78E2E8172EA34', percent: 0.0027898336728029924},
    {address: '0x66F576C1eDa4044A01bF68A78564F39bA3BbF65b', percent: 0.0031463681966039927},
    {address: '0xf578475B51f9f77b2421C321D4c0D530942a5448', percent: 0.0002896843005883128},
    {address: '0x860001218D2476481629B7c64960bd6eDbEdD848', percent: 0.006832435630649258},
    {address: '0x9E8784794cd73B52886cBB1A3538A4594A6c9e8d', percent: 0.0021382276512788246},
    {address: '0x43E0eeD8ef9f6A3BAE31151dbCcb778b809c5b7b', percent: 0.009264143107669997},
    {address: '0x5f350bF5feE8e254D6077f8661E9C7B83a30364e', percent: 0.00792628158989612},
    {address: '0x49072cd3Bf4153DA87d5eB30719bb32bdA60884B', percent: 0.00009709199085652244},
    {address: '0x359B0ceb2daBcBB6588645de3B480c8203aa5b76', percent: 0.0027026590226960543},
    {address: '0x6B12e9D58bB0fFbbDdAaF0F9461c00EA4c4b563f', percent: 0.015997038021224336},
    {address: '0x4421E6f16A59582c8108D153aAB0Fb7B4A3EDDbe', percent: 0.000029874458781777246},
    {address: '0x80C5f123248E5E196948c3d1a09Cb4FF0C437Dc2', percent: 0.0005094574697974386},
    {address: '0x994B5C8B30766EaCe220B76f8C1DE27849f05aB3', percent: 0.0000022038531723456476},
    {address: '0x673Ede4b865505BD157E3110d696647605aAe59d', percent: 0.12243630618497602}
  ];

  adjustments.forEach((adjustment) => {
    const user = getUser(adjustment.address);
    const amount = teamAndVotersVesting.liqAirdropAmount * BigInt(Math.round(adjustment.percent * 1e18)) / 1000000000000000000n;
    user.liqAirdropAmount += amount;
    user.totalAirdropAmount += amount;
  });

  teamAndVotersVesting.liqAirdropAmount = 0n;
  teamAndVotersVesting.totalAirdropAmount = 0n;
}

function incubatorAdjustments(): void {
  const incubators = getUser('0x9bc6dCC2497f1feB7Bc7D68CE658c2984C646172');

  const adjustments =  [
    { address: "0xcd3010D150B9674294A0589678E020372D8E5d8c", percent: 0.8063287762067906 },
    { address: "0x5592cB82f5B11A4E42B1275A973E6B712194e239", percent: 0.19367122379320947 }
  ];

  adjustments.forEach((adjustment) => {
    const user = getUser(adjustment.address);
    const amount = incubators.liqAirdropAmount * BigInt(Math.round(adjustment.percent * 1e18)) / 1000000000000000000n;
    user.liqAirdropAmount += amount;
    user.totalAirdropAmount += amount;
  });

  incubators.liqAirdropAmount = 0n;
  incubators.totalAirdropAmount = 0n;
}

function calculateAirdropAmounts(): void {
  const airdropAmount = 10_000_000n * 1_000_000_000_000_000_000n;
  const totalAmount = users.reduce((amount, user) => {
    amount += user.liqBalance;
    amount += user.liqLocked;
    return amount
  }, 0n);

  users.forEach((user) => {
    const liqAmount = user.liqBalance + user.liqLocked;
    const aridropAmount = liqAmount * airdropAmount / totalAmount;
    user.liqAirdropAmount = aridropAmount;
    user.totalAirdropAmount += aridropAmount;
  });
}

const BUNNI_V1_MAINNET_SUBGRAPH_ENDPOINT: string = `https://gateway.thegraph.com/api/${process.env.GRAPH_SUBGRAPH_KEY}/subgraphs/id/6EcVGBGhW8U6B9nd9uT1n5iDRMtH2evoJeaY5BXBCniM`


const liqLiquidityProviderQuery: string = gql`
  query LiqLiquidityProviderQuery (
    $skip: Int = 0,
    $first: Int = 1000
  ) {
    bunniToken (
      id: "0x8c733299c7512c405f80a0c21f9086b4782a88dd507366b0812e0e74ec5d7936",
      block: {
        number: 21121993
      }
    ) {
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