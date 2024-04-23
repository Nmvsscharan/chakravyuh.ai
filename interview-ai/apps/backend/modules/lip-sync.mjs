import { convertTextToSpeech } from "./elevenLabs.mjs";
import { getPhonemes } from "./rhubarbLipSync.mjs";
import { readJsonTranscript, audioFileToBase64 } from "../utils/files.mjs";

const MAX_RETRIES = 10;
const RETRY_DELAY = 2000;
// ------------------------------------

// async function lipSync({ messages }) {
//   if (!messages) {
//     // Handle the case where messages is undefined or null
//     console.error("Error: No messages received from OpenAI");
//     return []; // Or return an empty array or default value
//   }

//   // Rest of your lipSync logic using messages.map(...)
// }

// -------------------------------------------



const lipSync = async ({ messages }) => {
  if (!messages) {
    // Handle the case where messages is undefined or null
    console.error("Error: No messages received from OpenAI");
    return []; // Or return an empty array or default value
  }
  if (!messages || !Array.isArray(messages)) {
    // Handle the case where messages is undefined, null, or not an array
    console.error("Error: Invalid messages received from OpenAI");
    return []; // Or return an empty array or default value
  }
  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.mp3`;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          await convertTextToSpeech({ text: message.text, fileName });
          break;
        } catch (error) {
          if (error.response && error.response.status === 429 && attempt < MAX_RETRIES - 1) {
            await delay(RETRY_DELAY);
          } else {
            throw error;
          }
        }
      }
    })
  );

  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.mp3`;

      try {
        await getPhonemes({ message: index });
        message.audio = await audioFileToBase64({ fileName });
        message.lipsync = await readJsonTranscript({ fileName: `audios/message_${index}.json` });
      } catch (error) {
        console.error(`Error while getting phonemes for message ${index}:`, error);
      }
    })
  );

  return messages;
};

export { lipSync };