import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";
import dotenv from 'dotenv';
dotenv.config();
export function getPublicClient(_chain) {
    let RPC;
    switch (_chain.id) {
        case mainnet.id:
            RPC = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
            break;
        case sepolia.id:
            RPC = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
            break;
        default:
            throw new Error('Unknown chain');
    }
    return createPublicClient({
        chain: _chain,
        transport: http(RPC)
    });
}
//# sourceMappingURL=viem.js.map