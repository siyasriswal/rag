
import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

async function main() {
  const index = pc.index('siya');

  const stats = await index.describeIndexStats();

  console.log('Pinecone connection successful!');
  console.log(stats);
}

main().catch(console.error);
