import pool from '../config/db.js';

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
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar producto
    const [result] = await connection.query(
      `INSERT INTO products (category_id, name, description, price, status, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category_id || null, name, description, price, status || 'active', stock || 0]
    );
    const productId = result.insertId;

    // Insertar imágenes
    if (images.length > 0) {
      const imagesQuery = `INSERT INTO product_images (product_id, url, alt_text, position) VALUES ?`;
      const imagesValues = images.map((image) => [
        productId,
        image.url,
        image.alt_text || `Imagen ${image.position + 1}`,
        image.position || 0
      ]);
      await connection.query(imagesQuery, [imagesValues]);
    }

    // Insertar videos
    if (videos.length > 0) {
      const videosQuery = `INSERT INTO product_videos (product_id, url, position) VALUES ?`;
      const videosValues = videos.map((video) => [productId, video.url, video.position || 0]);
      await connection.query(videosQuery, [videosValues]);
    }

    await connection.commit();

    // Devolver el producto creado
    const [newProduct] = await connection.query(
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
      [productId]
    );
    return newProduct[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const update = async (id, category_id, name, description, price, status, stock, images = [], videos = []) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Actualizar producto
    const [result] = await connection.query(
      `UPDATE products 
       SET category_id = ?, name = ?, description = ?, price = ?, status = ?, stock = ?
       WHERE id = ?`,
      [category_id || null, name, description, price, status || 'active', stock || 0, id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return 0;
    }

    // Eliminar imágenes y videos existentes
    await connection.query(`DELETE FROM product_images WHERE product_id = ?`, [id]);
    await connection.query(`DELETE FROM product_videos WHERE product_id = ?`, [id]);

    // Insertar nuevas imágenes
    if (images.length > 0) {
      const imagesQuery = `INSERT INTO product_images (product_id, url, alt_text, position) VALUES ?`;
      const imagesValues = images.map((image) => [
        id,
        image.url,
        image.alt_text || `Imagen ${image.position + 1}`,
        image.position || 0
      ]);
      await connection.query(imagesQuery, [imagesValues]);
    }

    // Insertar nuevos videos
    if (videos.length > 0) {
      const videosQuery = `INSERT INTO product_videos (product_id, url, position) VALUES ?`;
      const videosValues = videos.map((video) => [id, video.url, video.position || 0]);
      await connection.query(videosQuery, [videosValues]);
    }

    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const remove = async (id) => {
  const [result] = await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
  return result.affectedRows;
};