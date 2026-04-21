require("dotenv").config();
const database = require("../config/database");
const Product = require("../models/model.product");
const VectorPG = require("../models/vectorProduct_pg");
const { createEmbedding } = require("../services/embedding.service");
const helper = require("./helper_indexing");

(async () => {
    await database.connect();
    await database.connectPostgresql();
    console.log("DB connected");

    const products = await Product.find({ deleted: false });
    console.log(`Đã tìm được ${products.length} sản phẩm`);

    for (const p of products) {
        const rawtext = `
         name: ${p.title}
         description: ${helper.cleanText(p.description)}
         price: ${p.price.toLocaleString("vi-VN")} VNĐ
      `;

        const chunks = helper.chunkByParagraph(rawtext, 500);

        await VectorPG.deleteBySourceId(p._id);

        //insert từng chunk
        let chunkId = 0;
        for (const chunk of chunks) {
            if (!chunk || chunk.length < 20) {
                continue;
            }
            const emb = await createEmbedding(chunk);
            if (!emb) {
                continue;
            }
            await VectorPG.insertChunk({
                source_id: p._id,
                chunk_index: chunkId++,
                chunk_text: chunk,
                embedding: emb,
                price: p.price
            });
        }
        console.log(`indexed: ${p.title}`);
    }

    console.log("OK");
    process.exit(0);
})();