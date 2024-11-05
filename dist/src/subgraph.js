import { gql, request } from 'graphql-request';
const SUBGRAPH_ENDPOINT = "https://subgraph.satsuma-prod.com/f277f161ad41/bacon-labs/bunni-v2-sepolia/version/v0.2.5/api";
// TODO transactions can be limited to between the quest dates
const query = gql `
  {
    users (first: 1000) {
      id
      transactions (first: 1000) {
        timestamp
        type
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
export function fetchSubgraphData() {
    request(SUBGRAPH_ENDPOINT, query);
}
//# sourceMappingURL=subgraph.js.map