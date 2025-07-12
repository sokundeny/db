import { pingUser, getUser, createUser, removeUser, assignRole, removeRole, getRole, createRole, updateUser, deleteRole ,updateRole} from "../api";
import { useEffect, useState } from "react";
import UserModal from "./UserModal";
import RoleModal from "./RoleModal";
import NewUserModal from "./NewUserModal";
import NewRoleModal from "./NewRoleModal";
import UpdateUserModal from "./UpdateModel"; // ✅ NEW IMPORT
import UpdateRoleModal from "./UpdateRoleModel";

const Body = () => {
    const [navItems] = useState(["User", "Role"]);
    const [selected, setSelected] = useState("User");
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [newUserModal, setNewUserModal] = useState(false);
    const [newRoleModal, setNewRoleModal] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false); // ✅ NEW
    const [updateRoleOpen,setUpdateRoleOpen]=useState(false)
    const [roleToUpdate, setRoleToUpdate] = useState(null);

    const getUsers = async () => {
        try {
            const user = await getUser();
            setUsers(user);
        } catch (error) {
            console.error(error);
        }
    };

    const getRoles = async () => {
        try {
            const role = await getRole();
            setRoles(role);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUsers();
        getRoles();
    }, []);

    const handleCreateUser = async (user) => {
        try {
            await createUser(user);
        } catch (error) {
            console.error(error);
        }
        closeCreateModal();
        window.location.reload();
    };

    const handleUpdateRoleOpen = (role) => {
    setRoleToUpdate(role);
    setUpdateRoleOpen(true);
    };
    const handleDeleteUser = async (user) => {
        try {
            await removeUser(user);
        } catch (error) {
            console.error(error);
        }
        handleCloseModal();
        window.location.reload();
    };

    const handleUpdate = async (name, newName, newPassword) => {
        try {
            await updateUser({ name, newName, newPassword });
        } catch (error) {
            console.error("Update error:", error);
        }
        setUpdateModalOpen(false);
        setSelectedUser(null);
        window.location.reload();
    };

    const handleSaveRoles = async (user, toAdd, toRemove) => {
        try {
            for (const role of toRemove) {
                await removeRole(user.user, role.toLowerCase());
            }

            for (const role of toAdd) {
                await assignRole(user.user, role.role.toLowerCase(), role.is_admin_option);
            }
        } catch (error) {
            console.error("Role save error:", error);
        }

        handleCloseModal();
        window.location.reload();
    };

    const handleManage = (user) => {
        setSelectedUser(user);
        setUpdateModalOpen(true);
    };

    const handleManageRole = (role) => {
        setSelectedRole(role);
    };

    const openCreateModal = () => {
        if (selected === "User") setNewUserModal(true);
        else if (selected === "Role") setNewRoleModal(true);
    };

    const closeCreateModal = () => {
        if (selected === "User") setNewUserModal(false);
        else if (selected === "Role") setNewRoleModal(false);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setSelectedRole(null);
    };

    const handleCreateRole = async (role) => {
        try {
            await createRole(role);
        } catch (error) {
            console.error(error);
        }
        closeCreateModal();
        window.location.reload();
    };

    const handleSaveRolePerms = async (diff) => {
        console.log("Permission Changes:", diff);
        // API call logic to be added
    };

    const handleDeleteRole = async (role) => {
        try {
            await deleteRole(role.role)
        } catch (error) {
            console.log(error)
        }
        handleCloseModal();
        window.location.reload();
        // Add deletion logic
    };
    const handleUpdateRole = async (originalRole, newRoleName) => {
    try {
      await updateRole({ originalRole, newRole: newRoleName });
    } catch (error) {
      console.error("Update role error:", error);
    }
    setUpdateRoleOpen(false);
    setRoleToUpdate(null);
    window.location.reload();
  };

    return (
        <div className="flex flex-col gap-4 h-full py-4">
            <div className="flex gap-4 mx-4">
                {navItems.map((nav, index) => (
                    <button
                        key={index}
                        className={`border border-gray-500 px-4 py-1 rounded-lg 
                            hover:bg-slate-500 hover:text-zinc-800
                            ${selected === nav ? "bg-blue-600" : "bg-black"}`}
                        onClick={() => setSelected(nav)}
                    >
                        {nav}
                    </button>
                ))}
            </div>

            <div className="h-0.5 w-full bg-zinc-800 "></div>

            <div className="mt-2 mx-4">
                <button
                    className="border border-gray-500 px-4 py-1 rounded-lg bg-gray-800"
                    onClick={openCreateModal}
                >
                    Create {selected}
                </button>
            </div>

            <div className="overflow-x-auto mx-4">
                {selected === "User" ? (
                    <table className="min-w-full bg-white shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Update</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.user}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.roles.map((r) => r.role).join(", ")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <button
                                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                            onClick={() => handleManage(user)}
                                        >
                                            Update User
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 flex justify-end">
                                        <button
                                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="min-w-full bg-white shadow-sm rounded-lg table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role, idx) => (
                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-600">{role.role}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 text-right space-x-2">
                            <button
                                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                onClick={() => handleUpdateRoleOpen(role)}
                            >
                                Update Role
                            </button>
                            <button
                                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                onClick={() => handleManageRole(role)}
                            >
                                Manage
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>

                )}
            </div>

            {/* ✅ Modals */}
            <UserModal
                user={selectedUser}
                roles={roles}
                isOpen={selectedUser && !updateModalOpen}
                onClose={handleCloseModal}
                onSaveRoles={handleSaveRoles}
                onDelete={handleDeleteUser}
            />
            <UpdateRoleModal
                isOpen={updateRoleOpen}
                role={roleToUpdate}
                onClose={() => {
                setUpdateRoleOpen(false);
                setRoleToUpdate(null);
                }}
                onUpdate={handleUpdateRole}
            />

            <UpdateUserModal
                isOpen={updateModalOpen}
                user={selectedUser}
                onClose={() => {
                    setUpdateModalOpen(false);
                    setSelectedUser(null);
                }}
                onUpdate={handleUpdate}
            />

            <RoleModal
                role={selectedRole}
                isOpened={selectedRole}
                onClosed={handleCloseModal}
                onDelete={handleDeleteRole}
                onSave={handleSaveRolePerms}
            />

            <NewUserModal
                isOpened={newUserModal}
                onClose={closeCreateModal}
                onCreateUser={handleCreateUser}
            />

            <NewRoleModal
                isOpened={newRoleModal}
                onClose={closeCreateModal}
                onCreateRole={handleCreateRole}
            />
        </div>
    );
};

export default Body;
