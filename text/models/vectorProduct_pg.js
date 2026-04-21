const { getPgPool } = require("../config/database");
module.exports.insertChunk = async ({
    source_id,
    chunk_index,
    chunk_text,
    embedding,
    price
}) => {
    const pool = getPgPool();
    const embeddingStr = `[${embedding.join(",")}]`;
    const sql = `
      INSERT INTO products_vector
      (source_id, type, chunk_index, chunk_text, embedding, price)
      VALUES ($1, 'product', $2, $3, $4::vector, $5)
    `;
    await pool.query(sql, [
        source_id.toString(),
        chunk_index,
        chunk_text,
        embeddingStr,
        price
    ]);
};


module.exports.deleteBySourceId = async (source_id) => {
    const pool = getPgPool();
    const sql = `
      DELETE FROM products_vector
      WHERE source_id = $1
    `;
    await pool.query(sql, [source_id.toString()]);
};


module.exports.searchSimilarProducts = async (queryEmbedding, limit = 5) => {
    const pool = getPgPool();
    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    const sql = `
    SELECT
      source_id,
      ARRAY_AGG(chunk_text ORDER BY chunk_index) AS chunks,
      MAX(price) AS price,
      MAX(1 - (embedding <=> $1)) AS similarity
    FROM products_vector
    GROUP BY source_id
    ORDER BY similarity DESC
    LIMIT $2
  `;
    const { rows } = await pool.query(sql, [embeddingStr, limit]);
    return rows;
};