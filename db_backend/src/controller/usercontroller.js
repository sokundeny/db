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
        const roles = [];

        for (const grantObj of grants) {
          const grantStr = Object.values(grantObj)[0];

          // Match roles list in the GRANT statement, e.g.:
          // GRANT `kik`@`%`,`kiki`@`%` TO `user`@`host` WITH ADMIN OPTION
          const rolesMatch = grantStr.match(/GRANT\s+((?:`[^`]+`@\`[^`]+\`,?\s*)+)TO/i);

          if (rolesMatch) {
            const rolesPart = rolesMatch[1]; // string of roles like `kik`@`%`,`kiki`@`%`

            // Split roles by comma, trimming spaces
            const roleEntries = rolesPart.split(',').map(r => r.trim());

            // Check if WITH ADMIN OPTION is present in this grant line
            const isAdmin = /WITH ADMIN OPTION/i.test(grantStr);

            for (const roleEntry of roleEntries) {
              // Extract role name inside backticks before the @
              const roleNameMatch = roleEntry.match(/`([^`]+)`@\`[^`]+\`/);
              if (roleNameMatch) {
                roles.push({
                  role: roleNameMatch[1].toUpperCase(),
                  is_admin_option: isAdmin
                });
              }
            }
          }
        }

        results.push({
          user,
          roles: roles.length > 0 ? roles : [{ role: 'NO ROLE', is_admin_option: false }]
        });

      } catch (err) {
        results.push({
          user,
          roles: [{ role: `ERROR: ${err.message}`, is_admin_option: false }]
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


    res.status(200).json({ message: `Role '${role}' revoked  from '${name}'` });

  } catch (error) {
    console.error("Error in removeRole:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, newPassword, newName } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Missing original username" });
    }

    // Rename user
    if (newName && newName !== name) {
      await pool.query(`RENAME USER \`${name}\`@'localhost' TO \`${newName}\`@'localhost'`);
    }

    // Change password
    if (newPassword) {
      const targetUser = newName || name; // Use updated name if it was changed
      await pool.query(`ALTER USER \`${targetUser}\`@'localhost' IDENTIFIED BY ?`, [String(newPassword)]);
    }

    res.status(200).json({ message: "User updated successfully" });

  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

