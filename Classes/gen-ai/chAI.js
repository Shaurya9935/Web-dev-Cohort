import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

export const apikeychecker = () => {
    if (!API_KEY) {
        console.error("Error: OPENAI_API_KEY is not set in the environment variables.");
        return false;
    }
    return true;
}

export const checkOpenAI = async () => {
    const openai = (await import('openai')).default;
    const client = new openai.OpenAI({
        apiKey: API_KEY,
    });
    
    if(!client) {
        console.error("Error: Failed to initialize OpenAI client.");
        process.exit(1);
    }
    console.log("OpenAI client initialized successfully.");
    return client;
}