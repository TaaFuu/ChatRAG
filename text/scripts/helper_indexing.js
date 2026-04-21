const he = require("he");
//clean HTML + khoảng trắng
module.exports.cleanText = (str = "") => {
    return he.decode(
        String(str)
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
    );
};

//Chunking
module.exports.chunkByParagraph = (text, maxLength = 500) => {
    const paragraphs = text
        .split(/\n+/)
        .map(p => p.trim())
        .filter(Boolean);

    const chunks = [];
    let buffer = "";
    for (const p of paragraphs) {
        if ((buffer + p).length <= maxLength) {
            buffer += (buffer ? "\n" : "") + p;
        } else {
            chunks.push(buffer);
            buffer = p;
        }
    }
    if (buffer) {
        chunks.push(buffer);
    }
    return chunks;
}