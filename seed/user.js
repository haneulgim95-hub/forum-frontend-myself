import dotenv from 'dotenv'
import path from 'path'
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env")});

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const BASE_URL = process.env.VITE_API_BASE_URL;
const API_URL = BASE_URL + "/admin/user/create";



async function generateUsers(count) {
    for (let i = 0; i < count; i++) {
        try {
            const unique = Math.random().toString(36).slice(-3);

            const dummyData = {
                username: `user_${unique}`,
                password: "password123",
                name: `name_${unique}`,
                nickname: `nickname_${unique}`,
                email: `email_${unique}@example.com`,
                gender: "MALE",
                role: "USER",
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${ADMIN_TOKEN}`,
                },
                body: JSON.stringify(dummyData),
            })
            console.log(`[${i+1}/${count}] ${response.ok ? "성공" : "실패"} / ${unique}`);
        } catch (error) {}
    }
}

generateUsers(3);
