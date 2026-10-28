import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone();
const NAME = 'dsa-rag-768';

await pinecone.deleteIndex('dsa-rag'); // remove the bad one (or delete it in the console)

await pinecone.createIndex({
  name: NAME,
  dimension: 768,
  metric: 'cosine',
  vectorType: 'dense',
  spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
  waitUntilReady: true,
});

console.log(await pinecone.describeIndex(NAME));