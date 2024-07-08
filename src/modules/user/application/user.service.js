import * as db from '../../../config/db/index.js';
import { Crypto } from '../../../common/classes/index.js';
import DatabaseError from '../../../common/classes/DatabaseError.js';

const UserService = {
  createUser: async (req, res, next) => {
    const { name, email, password, lang, role, avatarURL, currentDeviceId } =
      req.body;

    try {
      const hashedPassword = await Crypto.hashPassword(password); // TODO shouldn't be here
      const { rows } = await db.query(
        `INSERT INTO "User"(
      name, email, password, lang, role, "avatarURL", "currentDeviceId"
    ) VALUES ($1,$2,$3,$4,$5,$6,$7) 
    RETURNING *`,
        [name, email, hashedPassword, lang, role, avatarURL, currentDeviceId]
      );
      return rows;
    } catch (e) {
      return next(new DatabaseError(e));
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const { rows } = await db.query(`SELECT * FROM "User"`);
      return rows;
    } catch (e) {
      return next(new DatabaseError(e));
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const { rows } = await db.query(`SELECT * FROM "User" WHERE id = $1`, [
        Number(req.params.id),
      ]);
      return rows;
    } catch (e) {
      return next(new DatabaseError(e));
    }
  },
  updateUser: async (req, res, next) => {
    const { name, password, lang, role, avatarURL, currentDeviceId } = req.body;

    try {
      const newHashedPassword = await Crypto.hashPassword(password); // TODO shouldn't be here
      const { rows } = await db.query(
        `UPDATE "User"
        SET name              = CASE WHEN COALESCE($1) IS NOT NULL THEN $1 ELSE name END,
            password          = CASE WHEN COALESCE($2) IS NOT NULL THEN $2 ELSE password END,
            lang              = CASE WHEN COALESCE($3) IS NOT NULL THEN $3 ELSE lang END,
            role              = CASE WHEN COALESCE($4::"Role") IS NOT NULL THEN $4 ELSE role END,
            "avatarURL"       = CASE WHEN COALESCE($5) IS NOT NULL THEN $5 ELSE "avatarURL" END,
            "currentDeviceId" = CASE WHEN COALESCE($6::BIGINT) IS NOT NULL THEN $6 ELSE "currentDeviceId" END
        WHERE id = $7
        RETURNING *`,
        [
          name,
          newHashedPassword,
          lang,
          role,
          avatarURL,
          currentDeviceId,
          Number(req.params.id),
        ]
      );
      return rows;
    } catch (e) {
      return next(new DatabaseError(e));
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const { rows } = await db.query(
        `DELETE FROM "User" WHERE id = $1 RETURNING *`,
        [Number(req.params.id)]
      );
      return rows;
    } catch (e) {
      return next(new DatabaseError(e));
    }
  },
};

export default UserService;
