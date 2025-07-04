import { pool } from "../configs/connectdb.js";

/**
 * @swagger
 * tags:
 *   - name: Role
 *     description: Role management
 */

/**
 * @swagger
 * /api/role:
 *   get:
 *     summary: Get all roles with permissions on sms database
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: List of roles with permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     example: teacher_role
 *                   tables:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         table:
 *                           type: string
 *                           example: "`sms`.`students`"
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: SELECT
 */
export const getAllRole = async (req, res) => {
  try {
    const [roles] = await pool.query(`
      SELECT user
      FROM mysql.user
      WHERE user NOT IN ('root', 'mysql.sys', 'mysql.session', 'mysql.infoschema')
        AND user NOT LIKE 'mysql.%'
        AND host IN ('%')
    `);

    const results = [];

    for (const { user: role } of roles) {
      try {
        const [grants] = await pool.query(`SHOW GRANTS FOR \`${role}\`@'%'`);

        const tablePermissionsMap = {};

        for (const grantObj of grants) {
          const grantStr = Object.values(grantObj)[0];

          // Match permissions and table
          const match = grantStr.match(/GRANT (.+?) ON (`?[\w*]+`?\.`?[\w*]+`?) /i);

          if (match) {
            const permsList = match[1]
              .split(',')
              .map(p => p.trim().toUpperCase())
              .filter(p => p.length > 0);

            const tableName = match[2]; // e.g. `sms`.`users`

            // Only consider permissions on sms database tables
            if (tableName.startsWith('`sms`.')) {
              if (!tablePermissionsMap[tableName]) {
                tablePermissionsMap[tableName] = new Set();
              }
              permsList.forEach(p => tablePermissionsMap[tableName].add(p));
            }
          }
        }

        // Skip roles with no sms tables permissions
        if (Object.keys(tablePermissionsMap).length === 0) {
          continue; // skip this role
        }

        const tables = Object.entries(tablePermissionsMap).map(([table, permsSet]) => ({
          table,
          permissions: [...permsSet]
        }));

        results.push({
          role,
          tables
        });

      } catch {
        continue; // skip roles with error
      }
    }

    res.status(200).json(results);

  } catch (error) {
    console.error("Error fetching roles and permissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/role:
 *   post:
 *     summary: Create new role with permissions
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - permissions
 *             properties:
 *               role:
 *                 type: string
 *                 description: Role name
 *                 example: teacher_role
 *               permissions:
 *                 type: array
 *                 description: List of permissions to grant (e.g., SELECT, INSERT)
 *                 items:
 *                   type: string
 *                   example: SELECT
 *               table:
 *                 type: array
 *                 description: Optional list of tables in sms database to grant permissions on
 *                 items:
 *                   type: string
 *                 example: [ "students", "courses" ]
 *     responses:
 *       200:
 *         description: Role created and permissions granted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Granted [SELECT, INSERT] on sms.students, sms.courses to role 'teacher_role'
 */
export const createRole = async (req, res) => {
  try {
    const { role, permissions, table } = req.body;

    if (!role || !permissions || !Array.isArray(permissions) || permissions.length === 0) {
      return res.status(400).json({ message: "roleName and permissions array are required" });
    }

    await pool.query(`CREATE ROLE IF NOT EXISTS \`${role}\``);

    const queries = [];
    const permissionList = permissions.map(p => p.toUpperCase()).join(", ");

    if (Array.isArray(table) && table.length > 0) {
      for (const t of table) {
        const sql = `GRANT ${permissionList} ON sms.\`${t}\` TO \`${role}\`;`;
        queries.push(pool.query(sql));
      }
    } else {
      const sql = `GRANT ${permissionList} ON sms.* TO \`${role}\`;`;
      queries.push(pool.query(sql));
    }

    await Promise.all(queries);
    await pool.query("FLUSH PRIVILEGES");

    res.status(200).json({
      message: `Granted [${permissionList}] on ${Array.isArray(table) ? table.map(t => `sms.${t}`).join(", ") : "sms.*"} to role '${role}'`
    });
  } catch (error) {
    console.error("Error granting role:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/role/grant:
 *   post:
 *     summary: Grant additional permissions to existing role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - permissions
 *             properties:
 *               role:
 *                 type: string
 *                 example: teacher_role
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "SELECT", "UPDATE" ]
 *               table:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "students" ]
 *     responses:
 *       200:
 *         description: Permissions granted to role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Granted [SELECT, UPDATE] on sms.students to role 'teacher_role'
 */
export const grantRole = async (req, res) => {
  try {
    const { role, permissions, table } = req.body;

    if (!role || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Role and permissions array are required" });
    }

    const permissionList = permissions.map(p => p.toUpperCase()).join(", ");

    const queries = [];

    if (Array.isArray(table) && table.length > 0) {
      for (const t of table) {
        const sql = `GRANT ${permissionList} ON sms.\`${t}\` TO \`${role}\`;`;
        queries.push(pool.query(sql));
      }
    } else {
      const sql = `GRANT ${permissionList} ON sms.* TO \`${role}\`;`;
      queries.push(pool.query(sql));
    }

    await Promise.all(queries);
    await pool.query("FLUSH PRIVILEGES");

    res.status(200).json({
      message: `Granted [${permissionList}] on ${Array.isArray(table) ? table.map(t => `sms.${t}`).join(", ") : "sms.*"} to role '${role}'`
    });
  } catch (error) {
    console.error("Error granting role:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * @swagger
 * /api/role:
 *   delete:
 *     summary: Delete a role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 example: teacher_role
 *     responses:
 *       200:
 *         description: Role deleted message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role 'teacher_role' has been deleted (if it existed).
 */
export const deleteRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role name is required" });
    }

    await pool.query(`DROP ROLE IF EXISTS \`${role}\``);
    await pool.query(`FLUSH PRIVILEGES`);

    res.status(200).json({ message: `Role '${role}' has been deleted (if it existed).` });

  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @swagger
 * /api/role/revoke:
 *   delete:
 *     summary: Revoke permissions from a role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - permissions
 *             properties:
 *               role:
 *                 type: string
 *                 example: teacher_role
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "SELECT", "UPDATE" ]
 *               table:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "students" ]
 *     responses:
 *       200:
 *         description: Permissions revoked from role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REVOKED [SELECT, UPDATE] on sms.students from role 'teacher_role'
 */
export const revokeRole = async (req, res) => {
  try {
    const { role, permissions, table } = req.body;

    if (!role || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Role and permissions array are required" });
    }

    const permissionList = permissions.map(p => p.toUpperCase().trim()).join(", ");

    const queries = [];

    if (Array.isArray(table) && table.length > 0) {
      for (const t of table) {
        const sql = `REVOKE ${permissionList} ON sms.\`${t}\` FROM \`${role}\`;`;
        queries.push(pool.query(sql));
      }
    } else {
      const sql = `REVOKE ${permissionList} ON sms.* FROM \`${role}\`;`;
      queries.push(pool.query(sql));
    }

    await Promise.all(queries);
    await pool.query("FLUSH PRIVILEGES");

    res.status(200).json({
      message: `REVOKED [${permissionList}] on ${Array.isArray(table) ? table.map(t => `sms.${t}`).join(", ") : "sms.*"} from role '${role}'`
    });
  } catch (error) {
    console.error("Error revoking role:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
