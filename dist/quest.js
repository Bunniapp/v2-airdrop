import { Deploy, Deposit, Swap, Withdraw } from "./class.js";
export function getCompletedQuests(_transactions) {
    let completedQuests = 0n;
    if (isQuestCompleted_1(_transactions))
        completedQuests++;
    if (isQuestCompleted_2(_transactions))
        completedQuests++;
    if (isQuestCompleted_3(_transactions))
        completedQuests++;
    if (isQuestCompleted_4(_transactions))
        completedQuests++;
    if (isQuestCompleted_5(_transactions))
        completedQuests++;
    if (isQuestCompleted_6(_transactions))
        completedQuests++;
    if (isQuestCompleted_7(_transactions))
        completedQuests++;
    if (isQuestCompleted_8(_transactions))
        completedQuests++;
    if (isQuestCompleted_9(_transactions))
        completedQuests++;
    if (isQuestCompleted_10(_transactions))
        completedQuests++;
    if (isQuestCompleted_11(_transactions))
        completedQuests++;
    return completedQuests;
}
function isQuestCompleted_1(_transactions) {
    const startTime = 1721606400;
    const endTime = 1722815999;
    const deploys = _transactions.filter((tx) => tx instanceof Deploy && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (swaps && swaps.length) {
        objectiveCompleted_1 = swaps.length >= 5;
    }
    // Objective #2
    if (deposits && deposits.length) {
        const uniquePools = new Set();
        const uniqueValidDeposits = deposits.filter((deposit) => {
            if (uniquePools.has(deposit.pool)) {
                return false;
            }
            else {
                uniquePools.add(deposit.pool);
                return true;
            }
        });
        objectiveCompleted_2 = uniqueValidDeposits.length >= 3;
    }
    // Objective #3
    if (deploys && deploys.length) {
        objectiveCompleted_3 = deploys.length > 0;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_2(_transactions) {
    const startTime = 1721606400;
    const endTime = 1722815999;
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() === "0x10a336c15521e76f5a700bc1c4c1aeaf7d39ae148b3ff5f1c7f2d31543284423".toLowerCase();
        });
        objectiveCompleted_1 = validDeposits.length >= 1;
    }
    // Objective #2
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return (swap.currency0.toLowerCase() === "0x1a2d66D21C5D2D1E80D2Ebbe73BDC1F5d8a6c52C".toLowerCase() &&
                swap.currency1.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase() &&
                swap.amount0 > 0 &&
                swap.amount1 < 0);
        });
        objectiveCompleted_2 = validSwaps.length >= 1;
    }
    // Objective #3
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() === "0xd11c702d3c17f81f79335be92cd430a98e69e06808fe774a74da775b2530b7a3".toLowerCase();
        });
        objectiveCompleted_3 = validDeposits.length >= 1;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_3(_transactions) {
    const startTime = 1721865600;
    const endTime = 1723075199;
    const deploys = _transactions.filter((tx) => tx instanceof Deploy && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deploys && deploys.length) {
        const validPools = deploys.filter((deploy) => {
            const validVault0 = deploy.vault0 &&
                (deploy.vault0.toLowerCase() === "0x672b7B6E0A9Cde6eEe871A8b8C766c3e58c132D4".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0xbC532AE3224c4E44C511C9d87A3F65BE719a9295".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0xDe0E71057a1FF098B430BC72Cef6e77F22AA96e3".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0xA192F694B169af60FCA30A08D677B6d3e71F8936".toLowerCase());
            const validVault1 = deploy.vault1 &&
                (deploy.vault1.toLowerCase() === "0x672b7B6E0A9Cde6eEe871A8b8C766c3e58c132D4".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0xbC532AE3224c4E44C511C9d87A3F65BE719a9295".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0xDe0E71057a1FF098B430BC72Cef6e77F22AA96e3".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0xA192F694B169af60FCA30A08D677B6d3e71F8936".toLowerCase());
            return validVault0 || validVault1;
        });
        objectiveCompleted_1 = validPools.length > 0;
    }
    // Objective #2
    if (deposits && deposits.length && deploys && deploys.length) {
        const validDeploys = deploys.filter((deploy) => {
            const validVault0 = deploy.vault0 &&
                (deploy.vault0.toLowerCase() === "0x672b7B6E0A9Cde6eEe871A8b8C766c3e58c132D4".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0xbC532AE3224c4E44C511C9d87A3F65BE719a9295".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0xDe0E71057a1FF098B430BC72Cef6e77F22AA96e3".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0xA192F694B169af60FCA30A08D677B6d3e71F8936".toLowerCase());
            const validVault1 = deploy.vault1 &&
                (deploy.vault1.toLowerCase() === "0x672b7B6E0A9Cde6eEe871A8b8C766c3e58c132D4".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0xbC532AE3224c4E44C511C9d87A3F65BE719a9295".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0xDe0E71057a1FF098B430BC72Cef6e77F22AA96e3".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0xA192F694B169af60FCA30A08D677B6d3e71F8936".toLowerCase());
            return validVault0 || validVault1;
        });
        const validDeposits = deposits.filter((deposit) => {
            return validDeploys.some((deploy) => deploy.pool === deposit.pool);
        });
        objectiveCompleted_2 = validDeposits.length > 0;
    }
    // Objective #3
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase() ||
                swap.currency0.toLowerCase() === "0xB5f214A5a9a12705A2Bc0cA94ddad7f9f425c46b".toLowerCase() ||
                swap.currency0.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase()) &&
                (swap.currency1.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase() ||
                    swap.currency1.toLowerCase() === "0xB5f214A5a9a12705A2Bc0cA94ddad7f9f425c46b".toLowerCase() ||
                    swap.currency1.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase()));
        });
        objectiveCompleted_3 = validSwaps.length >= 2;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_4(_transactions) {
    const startTime = 1722524400;
    const endTime = 1723733999;
    const deploys = _transactions.filter((tx) => tx instanceof Deploy && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() === "0x7802c33e5f3127b5adb2543bb161627a54edfe82800776a6658a18cefc05610a".toLowerCase();
        });
        objectiveCompleted_1 = validDeposits.length >= 1;
    }
    // Objective #2
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase() &&
                swap.currency1.toLowerCase() === "0xDfBBF048075D9db3c34aB34a0843bC16De8c3B3D".toLowerCase()) ||
                (swap.currency0.toLowerCase() === "0xDfBBF048075D9db3c34aB34a0843bC16De8c3B3D".toLowerCase() &&
                    swap.currency1.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase()));
        });
        objectiveCompleted_2 = validSwaps.length >= 2;
    }
    // Objective #3
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() !== "0x7802c33e5f3127b5adb2543bb161627a54edfe82800776a6658a18cefc05610a".toLowerCase();
        });
        objectiveCompleted_3 = validDeposits.length >= 1;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_5(_transactions) {
    const startTime = 1723042800;
    const endTime = 1724252399;
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const withdraws = _transactions.filter((tx) => tx instanceof Withdraw && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() === "0x8c20f13134a59bcdb2041abfe179c46f23236606f292498fd520718757d8a7ec".toLowerCase();
        });
        objectiveCompleted_1 = validDeposits.length >= 1;
    }
    // Objective #2
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0xB5f214A5a9a12705A2Bc0cA94ddad7f9f425c46b".toLowerCase() &&
                swap.currency1.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase()) ||
                (swap.currency0.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase() &&
                    swap.currency1.toLowerCase() === "0xB5f214A5a9a12705A2Bc0cA94ddad7f9f425c46b".toLowerCase()));
        });
        objectiveCompleted_2 = validSwaps.length >= 2;
    }
    // Objective #3
    if (withdraws && withdraws.length) {
        const validWithdraws = withdraws.filter((withdraw) => {
            return withdraw.pool.toLowerCase() === "0x8c20f13134a59bcdb2041abfe179c46f23236606f292498fd520718757d8a7ec".toLowerCase();
        });
        objectiveCompleted_3 = validWithdraws.length >= 1;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_6(_transactions) {
    const startTime = 1723741200;
    const endTime = 1725037199;
    const deploys = _transactions.filter((tx) => tx instanceof Deploy && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deploys && deploys.length) {
        const validPools = deploys.filter((deploy) => {
            const validVault0 = deploy.vault0 &&
                (deploy.vault0.toLowerCase() === "0xc0f4Ce3e8A4A055CEe8eCD0770781441522F3a9A".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0x0B35fFC0A27f48B8604355E5c140F3211cc06B1B".toLowerCase());
            const validVault1 = deploy.vault1 &&
                (deploy.vault1.toLowerCase() === "0xc0f4Ce3e8A4A055CEe8eCD0770781441522F3a9A".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0x0B35fFC0A27f48B8604355E5c140F3211cc06B1B".toLowerCase());
            return validVault0 && validVault1;
        });
        objectiveCompleted_1 = validPools.length > 0;
    }
    // Objective #2
    if (deploys && deploys.length && deposits && deposits.length) {
        const validDeploys = deploys.filter((deploy) => {
            const validVault0 = deploy.vault0 &&
                (deploy.vault0.toLowerCase() === "0xc0f4Ce3e8A4A055CEe8eCD0770781441522F3a9A".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0x0B35fFC0A27f48B8604355E5c140F3211cc06B1B".toLowerCase());
            const validVault1 = deploy.vault1 &&
                (deploy.vault1.toLowerCase() === "0xc0f4Ce3e8A4A055CEe8eCD0770781441522F3a9A".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0x0B35fFC0A27f48B8604355E5c140F3211cc06B1B".toLowerCase());
            return validVault0 && validVault1;
        });
        const validDeposits = deposits.filter((deposit) => {
            return validDeploys.some((deploy) => deploy.pool === deposit.pool);
        });
        objectiveCompleted_2 = validDeposits.length > 0;
    }
    // Objective #3
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase() ||
                swap.currency0.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase()) &&
                (swap.currency1.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase() ||
                    swap.currency1.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase()));
        });
        objectiveCompleted_3 = validSwaps.length >= 2;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_7(_transactions) {
    const startTime = 1724864400;
    const endTime = 1726074000;
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const withdraws = _transactions.filter((tx) => tx instanceof Withdraw && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() === "0xeddf6013c0cad3d6714987e62dc5e14bf212bf754690c92d49b9849793209659".toLowerCase();
        });
        objectiveCompleted_1 = validDeposits.length >= 1;
    }
    // Objective #2
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase() ||
                swap.currency0.toLowerCase() === "0x0C37612638b5b4Ca4Ad30c64eAD5Ca836a5430cE".toLowerCase()) &&
                (swap.currency1.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase() ||
                    swap.currency1.toLowerCase() === "0x0C37612638b5b4Ca4Ad30c64eAD5Ca836a5430cE".toLowerCase()));
        });
        objectiveCompleted_2 = validSwaps.length >= 3;
    }
    // Objective #3
    if (withdraws && withdraws.length) {
        const validWithdraws = withdraws.filter((withdraw) => {
            return withdraw.pool.toLowerCase() === "0xeddf6013c0cad3d6714987e62dc5e14bf212bf754690c92d49b9849793209659".toLowerCase();
        });
        objectiveCompleted_3 = validWithdraws.length >= 1;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_8(_transactions) {
    const startTime = 1725379200;
    const endTime = 1726588800;
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() === "0xd06ff94ec2d300ec88f120e96f5f3b130d60688b9c5c960349520ed291832cec".toLowerCase();
        });
        objectiveCompleted_1 = validDeposits.length >= 1;
    }
    // Objective #2
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase() ||
                swap.currency0.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase()) &&
                (swap.currency1.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase() ||
                    swap.currency1.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase()));
        });
        objectiveCompleted_2 = validSwaps.length >= 2;
    }
    // Objective #3
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() !== "0xd06ff94ec2d300ec88f120e96f5f3b130d60688b9c5c960349520ed291832cec".toLowerCase();
        });
        objectiveCompleted_3 = validDeposits.length >= 1;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_9(_transactions) {
    const startTime = 1726153200;
    const endTime = 1727362800;
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const withdraws = _transactions.filter((tx) => tx instanceof Withdraw && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deposits && deposits.length) {
        const validDeposits = deposits.filter((deposit) => {
            return deposit.pool.toLowerCase() === "0x3581632b56fec8b14ac9cfc95c4ceb53cc653c543477c8ae35d9c5069c02332a".toLowerCase();
        });
        objectiveCompleted_1 = validDeposits.length >= 1;
    }
    // Objective #2
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase() ||
                swap.currency0.toLowerCase() === "0xB887d06Bca2F44DE15e10e7a38BB8F99dee42D51".toLowerCase()) &&
                (swap.currency1.toLowerCase() === "0x67a53a2b9984AF64A2e27b1582bC72406a2317c3".toLowerCase() ||
                    swap.currency1.toLowerCase() === "0xB887d06Bca2F44DE15e10e7a38BB8F99dee42D51".toLowerCase()));
        });
        objectiveCompleted_2 = validSwaps.length >= 2;
    }
    // Objective #3
    if (withdraws && withdraws.length) {
        const validWithdraws = withdraws.filter((withdraw) => {
            return withdraw.pool.toLowerCase() === "0x3581632b56fec8b14ac9cfc95c4ceb53cc653c543477c8ae35d9c5069c02332a".toLowerCase();
        });
        objectiveCompleted_3 = validWithdraws.length >= 1;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_10(_transactions) {
    const startTime = 1726851600;
    const endTime = 1728061200;
    const deploys = _transactions.filter((tx) => tx instanceof Deploy && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deploys && deploys.length) {
        const validPools = deploys.filter((deploy) => {
            const validVault0 = deploy.vault0 &&
                (deploy.vault0.toLowerCase() === "0xEd98bEc4CDD2324DfE2537a496226CAFc01D6a7C".toLowerCase());
            const validVault1 = deploy.vault1 &&
                (deploy.vault1.toLowerCase() === "0xEd98bEc4CDD2324DfE2537a496226CAFc01D6a7C".toLowerCase());
            return validVault0 || validVault1;
        });
        objectiveCompleted_1 = validPools.length > 0;
    }
    // Objective #2
    if (deploys && deploys.length && deposits && deposits.length) {
        const validDeploys = deploys.filter((deploy) => {
            const validVault0 = deploy.vault0 &&
                (deploy.vault0.toLowerCase() === "0xEd98bEc4CDD2324DfE2537a496226CAFc01D6a7C".toLowerCase());
            const validVault1 = deploy.vault1 &&
                (deploy.vault1.toLowerCase() === "0xEd98bEc4CDD2324DfE2537a496226CAFc01D6a7C".toLowerCase());
            return validVault0 || validVault1;
        });
        const validDeposits = deposits.filter((deposit) => {
            return validDeploys.some((deploy) => deploy.pool === deposit.pool);
        });
        objectiveCompleted_2 = validDeposits.length > 0;
    }
    // Objective #3
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0x61dC265c543c5d280A5270f4b10DA8f9FA3ac66E".toLowerCase()) ||
                (swap.currency1.toLowerCase() === "0x61dC265c543c5d280A5270f4b10DA8f9FA3ac66E".toLowerCase()));
        });
        objectiveCompleted_3 = validSwaps.length >= 2;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
function isQuestCompleted_11(_transactions) {
    const startTime = 1727719200;
    const endTime = 1728928800;
    const deploys = _transactions.filter((tx) => tx instanceof Deploy && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const deposits = _transactions.filter((tx) => tx instanceof Deposit && startTime <= tx.timestamp && tx.timestamp <= endTime);
    const swaps = _transactions.filter((tx) => tx instanceof Swap && startTime <= tx.timestamp && tx.timestamp <= endTime);
    let objectiveCompleted_1 = false;
    let objectiveCompleted_2 = false;
    let objectiveCompleted_3 = false;
    // Objective #1
    if (deploys && deploys.length) {
        const validPools = deploys.filter((deploy) => {
            const validVault0 = deploy.vault0 &&
                (deploy.vault0.toLowerCase() === "0xa3993F60F716B8E5cA8865D4108c91D759320d60".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0x444B1EE1336a10fF05fE3c465DC5599bdDd1af87".toLowerCase());
            const validVault1 = deploy.vault1 &&
                (deploy.vault1.toLowerCase() === "0xa3993F60F716B8E5cA8865D4108c91D759320d60".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0x444B1EE1336a10fF05fE3c465DC5599bdDd1af87".toLowerCase());
            return validVault0 || validVault1;
        });
        objectiveCompleted_1 = validPools.length > 0;
    }
    // Objective #2
    if (deploys && deploys.length && deposits && deposits.length) {
        const validDeploys = deploys.filter((deploy) => {
            const validVault0 = deploy.vault0 &&
                (deploy.vault0.toLowerCase() === "0xa3993F60F716B8E5cA8865D4108c91D759320d60".toLowerCase() ||
                    deploy.vault0.toLowerCase() === "0x444B1EE1336a10fF05fE3c465DC5599bdDd1af87".toLowerCase());
            const validVault1 = deploy.vault1 &&
                (deploy.vault1.toLowerCase() === "0xa3993F60F716B8E5cA8865D4108c91D759320d60".toLowerCase() ||
                    deploy.vault1.toLowerCase() === "0x444B1EE1336a10fF05fE3c465DC5599bdDd1af87".toLowerCase());
            return validVault0 || validVault1;
        });
        const validDeposits = deposits.filter((deposit) => {
            return validDeploys.some((deploy) => deploy.pool === deposit.pool);
        });
        objectiveCompleted_2 = validDeposits.length > 0;
    }
    // Objective #3
    if (swaps && swaps.length) {
        const validSwaps = swaps.filter((swap) => {
            return ((swap.currency0.toLowerCase() === "0x83985Dc2c6f241b0301E5c88aD81677931c88760".toLowerCase() ||
                swap.currency0.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase()) &&
                (swap.currency1.toLowerCase() === "0x83985Dc2c6f241b0301E5c88aD81677931c88760".toLowerCase() ||
                    swap.currency1.toLowerCase() === "0x1ef5F52BdBe11Af2377C58ecC914A8c72Ea807cF".toLowerCase()));
        });
        objectiveCompleted_3 = validSwaps.length >= 2;
    }
    return objectiveCompleted_1 && objectiveCompleted_2 && objectiveCompleted_3;
}
//# sourceMappingURL=quest.js.map