import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { UPLOADS_DIR } from "../middlewares/upload.middleware.js";

// Best-effort removal of an uploaded image when its food item is deleted or
// its image is replaced. Only touches files under /uploads/.
const removeUploadedFile = (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename.includes("..")) return;
  fs.unlink(path.join(UPLOADS_DIR, filename), () => {});
};

class Food {
  constructor(
    id,
    name,
    description,
    price,
    chefId,
    imageUrl,
    categoryId,
    categoryName,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = Number(price);
    this.chefId = chefId;
    this.imageUrl = imageUrl;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
  }

  static mapRow(row) {
    return new Food(
      row.id,
      row.name,
      row.description,
      row.price,
      row.chef_id,
      row.image_url,
      row.category_id,
      row.category_name,
    );
  }

  static async findAll() {
    const result = await pool.query(
      `SELECT
        fi.id,
        fi.name,
        fi.description,
        fi.price,
        fi.chef_id,
        fi.image_url,
        fi.category_id,
        fc.name AS category_name
       FROM food_items fi
       JOIN food_categories fc ON fc.id = fi.category_id
       ORDER BY fi.created_at DESC`,
    );

    return result.rows.map(Food.mapRow);
  }

  static async findCategories() {
    const result = await pool.query(
      "SELECT id, name, description FROM food_categories ORDER BY name ASC",
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
    }));
  }

  static async create(name, description, price, chefId, imageUrl, categoryId) {
    const result = await pool.query(
      `INSERT INTO food_items (id, name, description, price, chef_id, image_url, category_id)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
       RETURNING
         id,
         name,
         description,
         price,
         chef_id,
         image_url,
         category_id,
         (SELECT name FROM food_categories WHERE id = $6) AS category_name`,
      [uuidv4(), name, description, price, chefId, imageUrl, categoryId],
    );

    return Food.mapRow(result.rows[0]);
  }

  static async updateById(
    id,
    name,
    description,
    price,
    chefId,
    imageUrl,
    categoryId,
  ) {
    const prev = await pool.query(
      "SELECT image_url FROM food_items WHERE id = $1",
      [id],
    );

    const result = await pool.query(
      `UPDATE food_items
       SET name = $1,
           description = $2,
           price = $3,
           chef_id = $4,
           image_url = $5,
           category_id = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING
         id,
         name,
         description,
         price,
         chef_id,
         image_url,
         category_id,
         (SELECT name FROM food_categories WHERE id = $6) AS category_name`,
      [name, description, price, chefId, imageUrl, categoryId, id],
    );

    if (!result.rows[0]) return null;

    // Remove the previously stored image if it was replaced with a new one.
    if (prev.rows[0] && prev.rows[0].image_url !== imageUrl) {
      removeUploadedFile(prev.rows[0].image_url);
    }

    return Food.mapRow(result.rows[0]);
  }

  static async deleteById(id) {
    const result = await pool.query(
      `DELETE FROM food_items
       WHERE id = $1
       RETURNING
         id,
         name,
         description,
         price,
         chef_id,
         image_url,
         category_id,
         (SELECT name FROM food_categories WHERE id = food_items.category_id) AS category_name`,
      [id],
    );

    if (!result.rows[0]) return null;

    // Free the uploaded image file.
    removeUploadedFile(result.rows[0].image_url);

    return Food.mapRow(result.rows[0]);
  }
}

export default Food;
