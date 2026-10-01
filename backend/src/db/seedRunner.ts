import { initDb } from './postgres';

async function runSeed() {
  console.log('Running database seed script...');
  await initDb();
  console.log('Seed runner completed.');
  process.exit(0);
}

runSeed().catch(err => {
  console.error('Seed runner failed:', err);
  process.exit(1);
});
