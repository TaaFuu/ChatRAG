const axios = require("axios");
require("dotenv").config();

const OLLAMA_API = process.env.OLLAMA_API || "http://127.0.0.1:11434";
const MODEL = "nomic-embed-text";

module.exports.createEmbedding = async (text) => {
    const res = await axios.post(`${OLLAMA_API}/api/embeddings`, {
        model: MODEL,
        prompt: text
    });

    return res.data.embedding;
};