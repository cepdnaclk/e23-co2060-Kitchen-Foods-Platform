import pool from "../config/db.js";

class User {
  constructor(uid, full_name, email, role, password_hash = null) {
    this.uid = uid;
    this.full_name = full_name;
    this.email = email;
    this.role = role;
    this.password_hash = password_hash;
  }

  static async findAll() {
    const result = await pool.query(
      "SELECT uid, full_name, email, role FROM users",
    );
    return result.rows.map(
      (row) => new User(row.uid, row.full_name, row.email, row.role),
    );
  }

  static async findById(uid) {
    const result = await pool.query(
      "SELECT uid, full_name, email, role FROM users WHERE uid = $1",
      [uid],
    );
    if (!result.rows[0]) return null;
    const r = result.rows[0];
    return new User(r.uid, r.full_name, r.email, r.role);
  }
  static async findByEmail(email) {
    const result = await pool.query(
      "SELECT uid, full_name, email, role, password_hash FROM users WHERE email = $1",
      [email],
    );
    if (!result.rows[0]) return null;
    const r = result.rows[0];
    return new User(r.uid, r.full_name, r.email, r.role, r.password_hash);
  }

  static async create(full_name, email, password_hash, role) {
    const result = await pool.query(
      "INSERT INTO users (uid, full_name, email, password_hash, role) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING uid, full_name, email, role",
      [full_name, email, password_hash, role],
    );
    const r = result.rows[0];
    return new User(r.uid, r.full_name, r.email, r.role);
  }

  static async updateById(uid, full_name, email, role) {
    const result = await pool.query(
      "UPDATE users SET full_name=$1, email=$2, role=$3 WHERE uid=$4 RETURNING uid, full_name, email, role",
      [full_name, email, role, uid],
    );
    if (!result.rows[0]) return null;
    const r = result.rows[0];
    return new User(r.uid, r.full_name, r.email, r.role);
  }

  static async deleteById(uid) {
    const result = await pool.query(
      "DELETE FROM users WHERE uid=$1 RETURNING uid, full_name, email, role",
      [uid],
    );
    if (!result.rows[0]) return null;
    const r = result.rows[0];
    return new User(r.uid, r.full_name, r.email, r.role);
  }
}

export default User;
