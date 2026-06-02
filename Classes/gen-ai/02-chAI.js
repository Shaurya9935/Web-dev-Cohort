import {checkOpenAI} from './chAI.js';

const client = await checkOpenAI();
const model = "gpt-4o-mini"

console.log(client)

const response = await client.chat.completions.create({
    model,
    messages:[{
        role: "system",
        
    },{}]
});