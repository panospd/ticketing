import dotenv from 'dotenv';
import path from 'path';

console.log(`============ env-setup Loaded ===========`);
console.log("Directory", process.cwd())
dotenv.config({ path: path.resolve(process.cwd(), "src", "test", '.env') });