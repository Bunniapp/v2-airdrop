export class User {
  address: string;

  // Testnet
  transactions: Transaction[];
  questCompletions: bigint;
  testnetAirdropAmount: bigint;

  // LIQ
  liqBalance: bigint;
  liqLocked: bigint;
  liqLPBalance: bigint;
  liqAirdropAmount: bigint;

  // veLIT
  veAmount: bigint;
  veLockEnd: bigint;
  liqLitAmount: bigint;
  stakedLiqLitAmount: bigint;
  balance_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3: bigint;
  balance_0xa6ece63a84224213a8a706e33b2073a2373335fa: bigint;
  balance_0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23: bigint;
  veAirdropAmount: bigint;

  // Airdrop
  totalAirdropAmount: bigint;

  constructor() {
    this.address = null;

    // Testnet
    this.transactions = null;
    this.questCompletions = 0n;
    this.testnetAirdropAmount = 0n;

    // veLIT Holder
    this.veAmount = 0n;
    this.veLockEnd = 0n;
    this.liqLitAmount = 0n;
    this.stakedLiqLitAmount = 0n;
    this.balance_0x37c80638b02ddd9d487320db1de90e50ec9c4ea3 = 0n;
    this.balance_0xa6ece63a84224213a8a706e33b2073a2373335fa = 0n;
    this.balance_0x318ed68a45d0e3ee08c36fa35bfac6f8bdcd4f23 = 0n;
    this.liqLPBalance = 0n;
    this.veAirdropAmount = 0n;

    // LIQ Holder
    this.liqBalance = 0n;
    this.liqLocked = 0n;
    this.liqAirdropAmount = 0n;

    // Airdrop
    this.totalAirdropAmount = 0n;
  }
}

export class Transaction {
  timestamp: number;

  amount0: number;
  amount1: number;

  pool: string;
  currency0: string;
  currency1: string;
  vault0: string;
  vault1: string;

  constructor(_timestamp: number) {
    this.timestamp = _timestamp;
  }
}

export class Deploy extends Transaction {
  constructor(_timestamp: number) {
    super(_timestamp);
  }
}

export class Deposit extends Transaction {
  constructor(_timestamp: number) {
    super(_timestamp);
  }
}

export class Withdraw extends Transaction {
  constructor(_timestamp: number) {
    super(_timestamp);
  }
}

export class Swap extends Transaction {
  constructor(_timestamp: number) {
    super(_timestamp);
  }
}