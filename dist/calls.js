import { mainnet } from 'viem/chains';
import BalancerPoolABI from './abi/BalancerPool.json' assert { type: 'json' };
import BalancerVaultABI from './abi/BalancerVault.json' assert { type: 'json' };
import { getPublicClient } from './viem.js';
export async function getLitPerBalancerPoolToken() {
    const client = getPublicClient(mainnet);
    const [totalSupplyResult, poolTokensResult] = await Promise.all([
        client.readContract({
            address: '0x9232a548DD9E81BaC65500b5e0d918F8Ba93675C',
            abi: BalancerPoolABI,
            functionName: 'totalSupply',
            blockNumber: 20866918
        }),
        client.readContract({
            address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
            abi: BalancerVaultABI,
            functionName: 'getPoolTokens',
            args: ['0x9232a548dd9e81bac65500b5e0d918f8ba93675c000200000000000000000423'],
            blockNumber: 20866918
        })
    ]);
    const litBalance = poolTokensResult[1][1];
    const litPerBalancePerPoolToken = litBalance * 1000000000000000000n / totalSupplyResult;
    return litPerBalancePerPoolToken;
}
//# sourceMappingURL=calls.js.map