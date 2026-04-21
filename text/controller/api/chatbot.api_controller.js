const { createEmbedding } = require("../../services/embedding.service");
const VectorPG = require("../../models/vectorProduct_pg");
const { askLLM } = require("../../services/LLM.service");

module.exports.searchPost = async (req, res) => {
    try {
        const questionUser = req.body.query;
        if (!questionUser) {
            return res.status(400).json({ message: "Thiếu câu hỏi" });
        }

        const embeddingQuestion = await createEmbedding(questionUser);
        if (!embeddingQuestion) {
            return res.status(500).json({ message: "Không tạo được embedding" });
        }

        const result = await VectorPG.searchSimilarProducts(embeddingQuestion, 5);

        if (!result || result.length === 0) {
            return res.json({
                answer: "Không tìm thấy dữ liệu phù hợp."
            });
        }
        const threshold = 0.5;
        const filterResult = result.filter(p => p.similarity >= threshold);

        if (filterResult.length === 0) {
            return res.json({
                answer: "Câu hỏi không liên quan đến dữ liệu sản phẩm hiện có."
            });
        }

        const context = filterResult.map((p, i) => `
        [SẢN PHẨM ${i + 1}]
        ${p.chunks.join("\n")}`.trim())
            .join("\n\n");


        console.log(context);
        const answer = await askLLM(questionUser, context);

        return res.json({
            answer,
            sources: filterResult.map(p => ({
                source_id: p.source_id,
                similarity: p.similarity
            }))
        });

    } catch (error) {
        console.error("Chatbot error:", error);
        return res.status(500).json({
            message: "Lỗi xử lý chatbot"
        });
    }
};