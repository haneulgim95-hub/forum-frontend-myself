import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

export const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
export const BASE_URL = process.env.VITE_API_BASE_URL;
