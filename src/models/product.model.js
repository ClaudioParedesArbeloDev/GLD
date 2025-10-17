import pool from "../config/db.js";

export const getAll = async () => {
  const [rows] = await pool.query(`
    SELECT p.*, c.name AS category_name,
           COALESCE(
             (SELECT JSON_ARRAYAGG(
               JSON_OBJECT('id', pi.id, 'url', pi.url, 'alt_text', pi.alt_text, 'position', pi.position)
             ) FROM product_images pi WHERE pi.product_id = p.id),
             JSON_ARRAY()
           ) AS images,
           COALESCE(
             (SELECT JSON_ARRAYAGG(
               JSON_OBJECT('id', pv.id, 'url', pv.url, 'position', pv.position)
             ) FROM product_videos pv WHERE pv.product_id = p.id),
             JSON_ARRAY()
           ) AS videos
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `);
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT p.*, c.name AS category_name,
           COALESCE(
             (SELECT JSON_ARRAYAGG(
               JSON_OBJECT('id', pi.id, 'url', pi.url, 'alt_text', pi.alt_text, 'position', pi.position)
             ) FROM product_images pi WHERE pi.product_id = p.id),
             JSON_ARRAY()
           ) AS images,
           COALESCE(
             (SELECT JSON_ARRAYAGG(
               JSON_OBJECT('id', pv.id, 'url', pv.url, 'position', pv.position)
             ) FROM product_videos pv WHERE pv.product_id = p.id),
             JSON_ARRAY()
           ) AS videos
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `,
    [id]
  );
  return rows[0];
};

export const create = async (category_id, name, description, price, status, stock, images = [], videos = []) => {
  const [result] = await pool.query(
    `INSERT INTO products (category_id, name, description, price, status, stock)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [category_id, name, description, price, status || 'active', stock || 0]
  );
  const productId = result.insertId;

  // Insertar imágenes
  for (const image of images) {
    await pool.query(
      `INSERT INTO product_images (product_id, url, alt_text, position)
       VALUES (?, ?, ?, ?)`,
      [productId, image.url, image.alt_text || '', image.position || 0]
    );
  }

  // Insertar videos
  for (const video of videos) {
    await pool.query(
      `INSERT INTO product_videos (product_id, url, position)
       VALUES (?, ?, ?)`,
      [productId, video.url, video.position || 0]
    );
  }

  return { id: result.insertId, category_id, name, description, price, status, stock, images, videos };
};

export const update = async (id, category_id, name, description, price, status, stock, images = [], videos = []) => {
  const [result] = await pool.query(
    `UPDATE products 
     SET category_id = ?, name = ?, description = ?, price = ?, status = ?, stock = ?
     WHERE id = ?`,
    [category_id, name, description, price, status || 'active', stock || 0, id]
  );

  if (result.affectedRows === 0) return 0;

  // Eliminar imágenes y videos existentes
  await pool.query(`DELETE FROM product_images WHERE product_id = ?`, [id]);
  await pool.query(`DELETE FROM product_videos WHERE product_id = ?`, [id]);

  // Insertar nuevas imágenes
  for (const image of images) {
    await pool.query(
      `INSERT INTO product_images (product_id, url, alt_text, position)
       VALUES (?, ?, ?, ?)`,
      [id, image.url, image.alt_text || '', image.position || 0]
    );
  }

  // Insertar nuevos videos
  for (const video of videos) {
    await pool.query(
      `INSERT INTO product_videos (product_id, url, position)
       VALUES (?, ?, ?)`,
      [id, video.url, video.position || 0]
    );
  }

  return result.affectedRows;
};

export const remove = async (id) => {
  const [result] = await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
  return result.affectedRows;
};