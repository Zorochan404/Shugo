import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { openAiApiKey } from "../config/env";
import { PromptTemplate } from "@langchain/core/prompts";




const llm = new ChatGoogleGenerativeAI({ apiKey :  openAiApiKey})


const tweetTemplate = 'give uses for a medicine, {medicine}'

const tweetPrompt = PromptTemplate.fromTemplate(tweetTemplate)
const tweetChain = tweetPrompt.pipe(llm)
const response = await tweetChain.invoke({medicine: 'avil'})
console.log(response.content)