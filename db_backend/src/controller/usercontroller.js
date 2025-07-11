import { pool } from "../configs/connectdb.js"
/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User and Role management
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users with their assigned roles and admin option status
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users with their roles and admin options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                     example: johndoe
 *                   role:
 *                     type: string
 *                     example: DEVELOPER
 *                   is_admin_option:
 *                     type: boolean
 *                     example: true
 */
export const getAllUser = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT user FROM mysql.user
      WHERE user NOT IN ('mysql.sys', 'mysql.session', 'mysql.infoschema', 'root')
        AND user NOT LIKE 'mysql.%'
        AND authentication_string != '' -- only real users, not roles
    `);

    const results = [];

    for (const { user } of users) {
      try {
        const [grants] = await pool.query(`SHOW GRANTS FOR \`${user}\`@\`localhost\``);
        let assignedRole = null;
        let isAdminOption = false;

        for (const grantObj of grants) {
          const grantStr = Object.values(grantObj)[0];

          // Match GRANT `role`@`%` TO 'user'@'host'
          const match = grantStr.match(/GRANT [`']?(\w+)[`']?@[`']?.*?[`']? TO/i);
          if (match) {
            assignedRole=match[1].toUpperCase(); // e.g. DEVELOPER
          }

          // Check if WITH ADMIN OPTION is present
          if (/WITH ADMIN OPTION/i.test(grantStr)) {
            isAdminOption = true;
          }
        }

        results.push({
          user,
          role: assignedRole || 'NO ROLE',
          is_admin_option: isAdminOption
        });

      } catch (err) {
        results.push({
          user,
          role: `ERROR: ${err.message}`,
          is_admin_option: false
        });
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching users and roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user with password
 *     tags: [User]
 *     requestBody:
 *       description: User details to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: myStrongPassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user created
 *       400:
 *         description: User already exists or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User 'johndoe' already exists.
 */

export const createUser = async (req,res)=>{
    try {
        const {name,password}=req.body;
        const [rows] = await pool.query(`SELECT COUNT(*) as count FROM mysql.user WHERE user = ? AND host = 'localhost'`, [name]);
    
        if (rows[0].count > 0) {
          return res.status(400).json({ message: `User '${name}' already exists.` });
        }
        const [result]= await pool.query(`create user '${name}'@'localhost' Identified by ?`,[password])
        res.status(201).json({message:'user created'})
    } catch (error) {
        console.error("Error creating users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
/**
 * @swagger
 * /api/user/role:
 *   post:
 *     summary: Assign a role to a user, optionally with admin option
 *     tags: [User]
 *     requestBody:
 *       description: Role assignment details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: johndoe
 *               role:
 *                 type: string
 *                 example: developer_role
 *               is_admin_option:
 *                 type: boolean
 *                 description: Whether to grant WITH ADMIN OPTION
 *                 example: true
 *     responses:
 *       200:
 *         description: Role granted to user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role 'developer_role' granted to user 'johndoe' with ADMIN OPTION
 *       400:
 *         description: Missing user name or role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User name and role are required
 */
export const assignRole = async (req, res) => {
  try {
    
    const { name, role, is_admin_option } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "User name and role are required" });
    }

    // Construct GRANT statement
    let sql = `GRANT \`${role}\` TO '${name}'@'localhost'`;
    if (is_admin_option) {
      sql += " WITH ADMIN OPTION";
    }

    await pool.query(sql);
    await pool.query(`set default role ${role} to '${name}'@'localhost'`)

    res.status(200).json({
      message: `Role '${role}' granted to user '${name}'${is_admin_option ? " with ADMIN OPTION" : ""}`
    });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Delete a user by name
 *     tags: [User]
 *     requestBody:
 *       description: User name to delete
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: johndoe
 *     responses:
 *       200:
 *         description: User deleted successfully (or did not exist)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User 'johndoe' dropped successfully (if existed)
 *       400:
 *         description: Missing user name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User name is required
 */
export const deleteUser = async (req, res) => {
  try {
    console.log(req.body)
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "User name is required" });
    }

    // Use `IF EXISTS` to prevent error if user does not exist
    await pool.query(`DROP USER IF EXISTS \`${name}\`@'localhost'`);

    res.status(200).json({ message: `User '${name} dropped successfully (if existed)` });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
/**
 * @swagger
 * /api/user/role:
 *   delete:
 *     summary: Remove a role from a user and reset default role to NONE
 *     tags: [User]
 *     requestBody:
 *       description: Role removal details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: johndoe
 *               role:
 *                 type: string
 *                 example: developer_role
 *     responses:
 *       200:
 *         description: Role revoked and default role set to NONE
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role 'developer_role' revoked and default role set to NONE for 'johndoe'
 *       400:
 *         description: Missing user name or role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User name and role are required
 */
export const removeRole = async (req, res) => {
  try {
    let { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "User name and role are required" });
    }
    // Revoke the role from the user
    await pool.query(`REVOKE ${role} FROM \`${name}\`@'localhost'`);

    // Set default role to NONE
    await pool.query(`SET DEFAULT ROLE NONE TO \`${name}\`@'localhost'`);

    res.status(200).json({ message: `Role '${role}' revoked and default role set to NONE for '${name}'` });

  } catch (error) {
    console.error("Error in removeRole:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
