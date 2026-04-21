const { Ollama } = require("ollama");

const client = new Ollama({
    host: "http://127.0.0.1:11434"
});

module.exports.askLLM = async (question, context) => {
    const prompt = `
        Bạn là trợ lý AI cho hệ thống tra cứu sản phẩm.

        QUY TẮC:
            - CHỈ sử dụng thông tin trong phần DỮ LIỆU LIÊN QUAN.
            - NẾU không có thông tin để trả lời, hãy nói: "Tôi không tìm thấy thông tin phù hợp trong dữ liệu hiện có."
            - KHÔNG suy đoán, KHÔNG tự bịa.

        --- DỮ LIỆU LIÊN QUAN ---
                ${context}

        --- CÂU HỎI ---
                ${question}
Hãy trả lời ngắn gọn, rõ ràng bằng tiếng Việt.`;
    try {
        const response = await client.chat({
            model: "llama3:latest",
            messages: [
                { role: "user", content: prompt }
            ],
            stream: false
        });
        return response?.message?.content;
    } catch (error) {
        console.log("Lỗi LLM:", error);
        return "LLM lỗi, không tạo được câu trả lời.";
    }
}