import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

class User {
  constructor(
    uid,
    full_name,
    email,
    role,
    password_hash = null,
    approval_status = null,
  ) {
    this.uid = uid;
    this.full_name = full_name;
    this.email = email;
    this.role = role;
    this.password_hash = password_hash;
    this.approval_status = approval_status;
  }

  static async findAll() {
    const result = await pool.query(
      `SELECT uid, full_name, email, role, NULL::varchar AS approval_status FROM users
       UNION ALL
       SELECT uid, full_name, email, role, approval_status FROM chefs
       UNION ALL
       SELECT uid, full_name, email, role, NULL::varchar AS approval_status FROM admin`,
    );
    return result.rows.map(
      (row) =>
        new User(
          row.uid,
          row.full_name,
          row.email,
          row.role,
          null,
          row.approval_status,
        ),
    );
  }

  static async findById(uid) {
    const result = await pool.query(
      `SELECT uid, full_name, email, role, NULL::varchar AS approval_status FROM users WHERE uid = $1
       UNION ALL
       SELECT uid, full_name, email, role, approval_status FROM chefs WHERE uid = $1
       UNION ALL
       SELECT uid, full_name, email, role, NULL::varchar AS approval_status FROM admin WHERE uid = $1`,
      [uid],
    );
    if (!result.rows[0]) return null;
    const r = result.rows[0];
    return new User(
      r.uid,
      r.full_name,
      r.email,
      r.role,
      null,
      r.approval_status,
    );
  }

  static async findByEmail(email) {
    const result = await pool.query(
      `SELECT uid, full_name, email, role, password_hash, NULL::varchar AS approval_status FROM users WHERE email = $1
       UNION ALL
       SELECT uid, full_name, email, role, password_hash, approval_status FROM chefs WHERE email = $1
       UNION ALL
       SELECT uid, full_name, email, role, password_hash, NULL::varchar AS approval_status FROM admin WHERE email = $1`,
      [email],
    );
    if (!result.rows[0]) return null;
    const r = result.rows[0];
    return new User(
      r.uid,
      r.full_name,
      r.email,
      r.role,
      r.password_hash,
      r.approval_status,
    );
  }

  static async create(full_name, email, password_hash, role) {
    let tableName = "users";
    if (role === "Chef") {
      tableName = "chefs";
    } else if (role === "Admin") {
      tableName = "admin";
    }

    // Chefs always start in the "Pending" state until an admin approves them.
    // Customers/admins have no approval column, so only chefs carry the status.
    const isChef = role === "Chef";
    const columns = isChef
      ? "(uid, full_name, email, password_hash, role, approval_status)"
      : "(uid, full_name, email, password_hash, role)";
    const values = isChef
      ? "($1, $2, $3, $4, $5, 'Pending')"
      : "($1, $2, $3, $4, $5)";
    const returning = isChef
      ? "RETURNING uid, full_name, email, role, approval_status"
      : "RETURNING uid, full_name, email, role, NULL::varchar AS approval_status";

    const result = await pool.query(
      `INSERT INTO ${tableName} ${columns} VALUES ${values} ${returning}`,
      [uuidv4(), full_name, email, password_hash, role],
    );
    const r = result.rows[0];
    return new User(r.uid, r.full_name, r.email, r.role, null, r.approval_status);
  }

  /** Update only the approval status of a chef (Pending/Approved/Rejected). */
  static async updateApprovalStatusById(uid, approvalStatus) {
    const result = await pool.query(
      `UPDATE chefs
       SET approval_status = $2
       WHERE uid = $1
       RETURNING uid, full_name, email, role, approval_status`,
      [uid, approvalStatus],
    );
    if (!result.rows[0]) return null;
    const r = result.rows[0];
    return new User(r.uid, r.full_name, r.email, r.role, null, r.approval_status);
  }

  static async updateById(uid, full_name, email, role) {
    let result = await pool.query(
      "UPDATE users SET full_name=$1, email=$2, role=$4 WHERE uid=$3 RETURNING uid, full_name, email, role",
      [full_name, email, uid, role],
    );
    if (result.rows[0]) {
      const r = result.rows[0];
      return new User(r.uid, r.full_name, r.email, r.role);
    }

    result = await pool.query(
      "UPDATE chefs SET full_name=$1, email=$2, role=$4 WHERE uid=$3 RETURNING uid, full_name, email, role",
      [full_name, email, uid, role],
    );
    if (result.rows[0]) {
      const r = result.rows[0];
      return new User(r.uid, r.full_name, r.email, r.role);
    }

    result = await pool.query(
      "UPDATE admin SET full_name=$1, email=$2, role=$4 WHERE uid=$3 RETURNING uid, full_name, email, role",
      [full_name, email, uid, role],
    );
    if (result.rows[0]) {
      const r = result.rows[0];
      return new User(r.uid, r.full_name, r.email, r.role);
    }

    return null;
  }

  static async deleteById(uid) {
    let result = await pool.query(
      "DELETE FROM users WHERE uid=$1 RETURNING uid, full_name, email, role",
      [uid],
    );
    if (result.rows[0]) {
      const r = result.rows[0];
      return new User(r.uid, r.full_name, r.email, r.role);
    }

    result = await pool.query(
      "DELETE FROM chefs WHERE uid=$1 RETURNING uid, full_name, email, role",
      [uid],
    );
    if (result.rows[0]) {
      const r = result.rows[0];
      return new User(r.uid, r.full_name, r.email, r.role);
    }

    result = await pool.query(
      "DELETE FROM admin WHERE uid=$1 RETURNING uid, full_name, email, role",
      [uid],
    );
    if (result.rows[0]) {
      const r = result.rows[0];
      return new User(r.uid, r.full_name, r.email, r.role);
    }

    return null;
  }
}

export default User;
