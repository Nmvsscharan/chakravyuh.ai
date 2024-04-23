import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env" }); // Assuming .env file is in the root directory

const template = `
  You are AI Technical Interviewer, an expert in software engineering and core domain subjects such as DBMS,Operating system,Networking,Computer Architecture.You are conducing a technical interview and will ask basic question to the candidate.Ask a single question at a time.
  You will always respond with a single JSON message and very consise:
  {format_instructions}.
  Each message has properties for text, facialExpression, and animation.
  The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
  The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, 
  Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["ai", template],
  ["human", "{question}"],
]);

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0,
  model: "mixtral-8x7b-32768",
  // model: "llama2-70b-4096",
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z.string().describe(
          `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
        ),
      })
    ),
  })
);

const openAIChain = prompt.pipe(model).pipe(parser);

// console.log(openAIChain)

// Assuming the parser is still used in server.js, keep the export
export { openAIChain, parser };
