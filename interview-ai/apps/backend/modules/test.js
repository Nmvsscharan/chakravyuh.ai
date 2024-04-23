// import { ChatGroq } from "@langchain/groq";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { StructuredOutputParser } from "langchain/output_parsers";
// import { z } from "zod";
// import dotenv from "dotenv";

// dotenv.config();

// const model = new ChatGroq({
//     apiKey: process.env.GROQ_API_KEY,
//     temperature: 0,
//     model: "mixtral-8x7b-32768",
  
//   });
  
//   const parser = StructuredOutputParser.fromZodSchema(
//     z.object({
//       messages: z.array(
//         z.object({
//           text: z.string().describe("Text to be spoken by the AI"),
//           facialExpression: z
//             .string()
//             .describe(
//               "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
//             ),
//           animation: z
//             .string()
//             .describe(
//               `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
//               Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
//             ),
//         })
//       ),
//     })
//   );
  

// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "You are a helpful assistant"],
//   ["human", "{input}"],
// ]);
// const chain = prompt.pipe(model).pipe(parser);
// // const openAIChain = prompt.pipe(model).pipe(parser);
// const response = await chain.invoke({
//   input: "Hello",
// });

// console.log("response", response.messages);
// /**
// response AIMessage {
//   content: "Hello! I'm happy to assist you in any way I can. Is there something specific you need help with or a question you have?",
// }
//  */


import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the chatbot components
async function initializeChatbot() {
    try {
        const model = createChatGroqModel();
        const parser = createOutputParser();

        // Define the conversation prompt
        const prompt = createChatPrompt();

        // Construct the chatbot chain
        const chain = prompt.pipe(model).pipe(parser);

        // Invoke the chatbot with an initial input
        const response = await invokeChatbot(chain, "Hello");

        console.log("Response:", response.messages);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Create the ChatGroq model
function createChatGroqModel() {
    return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        temperature: 0,
        model: "mixtral-8x7b-32768",
    });
}

// Create the output parser
// Create the output parser
function createOutputParser() {
    return {
        parse: (text) => {
            // Check if the text is valid JSON
            try {
                const json = JSON.parse(text);
                return json;
            } catch (error) {
                // If parsing as JSON fails, treat the text as a single message
                return {
                    messages: [{
                        text: text,
                        facialExpression: "default", // Set default facial expression
                        animation: "Idle" // Set default animation
                    }]
                };
            }
        }
    };
}


// Create the chat prompt template
function createChatPrompt() {
    return ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant"],
        ["human", "{input}"],
    ]);
}

// Invoke the chatbot with an initial input
// Invoke the chatbot with an initial input
async function invokeChatbot(chain, initialInput) {
    const response = await chain.invoke({ input: initialInput });

    // Wrap the plain text output in a JSON structure
    const jsonResponse = {
        messages: [{
            text: response.llmOutput,
            facialExpression: "default", // Set default facial expression
            animation: "Idle" // Set default animation
        }]
    };

    return jsonResponse;
}


// Start the chatbot initialization process
initializeChatbot();
