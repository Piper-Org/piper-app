import { SuiGrpcClient } from '@mysten/sui/grpc';
import { SuiGraphQLClient } from '@mysten/sui/graphql';

const grpcClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const gqlClient = new SuiGraphQLClient({
  network: 'testnet',
  url: 'https://graphql.testnet.sui.io/graphql',
});

async function main() {
  console.log('Testing gRPC and GraphQL on Sui testnet...');

  // 1. gRPC Gas Price
  const gasPrice = await grpcClient.getReferenceGasPrice();
  console.log('gRPC reference gas price:', gasPrice.referenceGasPrice);

  // 2. Query recent StreamCreated / StreamRevoked events using GraphQL
  const gqlEvents = await gqlClient.query({
    query: `
      query GetRecentEvents {
        events(first: 5, filter: { type: "0x8f33eecb14d7990f19374499622f8ac4f9d493ace3368209f3969ccc149d3da7::events::StreamCreated" }) {
          nodes {
            timestamp
            contents {
              json
              type {
                repr
              }
            }
            transaction {
              digest
            }
          }
        }
      }
    `,
  });

  const eventNodes = gqlEvents.data?.events?.nodes ?? [];
  console.log(`Found ${eventNodes.length} StreamCreated events via GraphQL.`);

  // 3. gRPC Object lookup
  const objRes = await grpcClient.getObject({
    objectId: '0x0000000000000000000000000000000000000000000000000000000000000005',
    include: { json: true },
  });
  console.log('gRPC Object 0x5 type:', objRes.object?.type);
}

main().catch(console.error);
