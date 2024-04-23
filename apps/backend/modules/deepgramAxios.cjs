// const axios = require("axios");
// const fs = require("fs-extra");
// const deepgramAPIV1 = "https://api.deepgram.com/v1";



// /**

// Function initializes DeepGram API.

// @param {Object} - An object containing the API Key and API Version [default: DeepGram V1].
// */
// function DeepGram(options = {
//     apiKey: "",
//     voiceId: ""
// }) {

//     this.apiKey = options.apiKey ? options.apiKey : "";
//     this.voiceId = options.voiceId ? options.voiceId : "aura-asteria-en"; // Default voice 

//     if(this.apiKey === ""){
//         console.log("ERR: Missing API key");
//         return;
//     }
// }


// /**

// Function that converts text to speech and saves the audio file to the specified file name.

// @param {string} voiceId - A different ID for the voice to use with the text-to-speech conversion.

// @param {string} fileName - The name of the file to save the audio data to.

// @param {string} textInput - The text to convert to speech.

// @returns {Object} - An object containing the status of the operation.
// */
// DeepGram.prototype.textToSpeech = async function({
//     voiceId,
//     fileName,
//     textInput,
// }) {
//     try {
//         if (!fileName) {
//             console.log("ERR: Missing parameter {fileName}");
//             return;
//         } else if (!textInput) {
//             console.log("ERR: Missing parameter {textInput}");
//             return;
//         }

//         const voiceIdValue = voiceId ? voiceId : this.voiceId;
//         const voiceURL = `${deepgramAPIV1}/speak?model=${voiceIdValue}`;
// // -------------------------------------------------------------------------------

//         // const url = "https://api.deepgram.com/v1/speak?model=aura-asteria-en";
//         const url = voiceURL;
//         const apiKey = this.apiKey;
//         const data = {
//         // text: "Hello, how can I help you today?",
//         text: textInput,
//         };

//         const config = {
//         headers: {
//             Authorization: `Token ${apiKey}`,
//             "Content-Type": "application/json",
//         },
//         responseType: "stream", // Ensure the response is treated as a stream
//         };

//         const response = await axios
//         .post(url, data, config)
//         .then((response) => {
//             if (response.status !== 200) {
//             console.error(`HTTP error! Status: ${response.status}`);
//             return;
//             }

//             const dest = fs.createWriteStream(fileName);
//             response.data.pipe(dest);
//             dest.on("finish", () => {
//             console.log("File saved successfully.");
//             });
//         })
//         .catch((error) => {
//             console.error("Error:", error.message);
//         });
//     }}


// module.exports = DeepGram;


const axios = require("axios");
const fs = require("fs-extra");

const DEEPGRAM_API_V1 = "https://api.deepgram.com/v1";

class DeepGram {
    constructor(options = { apiKey: "", voiceId: "aura-asteria-en" }) {
        this.apiKey = options.apiKey;
        this.voiceId = options.voiceId;
        
        if (!this.apiKey) {
            console.error("Error: Missing API key");
            return;
        }
    }

    async textToSpeech({ voiceId, fileName, textInput }) {
        if (!fileName) {
            console.error("Error: Missing parameter {fileName}");
            return;
        } else if (!textInput) {
            console.error("Error: Missing parameter {textInput}");
            return;
        }

        const voiceIdValue = voiceId || this.voiceId;
        const url = `${DEEPGRAM_API_V1}/speak?model=${voiceIdValue}`;
        
        const data = { text: textInput };
        const config = {
            headers: {
                Authorization: `Token ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            responseType: "stream",
        };

        try {
            const response = await axios.post(url, data, config);
            if (response.status !== 200) {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }

            const dest = fs.createWriteStream(fileName);
            response.data.pipe(dest);
            dest.on("finish", () => {
                console.log("File saved successfully.");
            });
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
}

module.exports = DeepGram;
