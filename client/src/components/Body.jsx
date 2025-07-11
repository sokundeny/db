import { pingUser, getUser, createUser, removeUser, assignRole, removeRole, getRole, createRole } from "../api"
import { useEffect, useState } from "react"
import UserModal from "./UserModal"
import RoleModal from "./RoleModal"
import NewUserModal from "./NewUserModal"
import NewRoleModal from "./NewRoleModal"

const Body = () => {

    const [ navItems, setNavItems ] = useState(["User", "Role"]);
    const [ selected, setSelected ] = useState("User")
    const [ users, setUsers ] = useState([]);
    const [ roles, setRoles ] = useState([]);
    const [ selectedUser, setSelectedUser ] = useState(null);
    const [ selectedRole, setSelectedRole ] = useState(null)
    const [ newUserModal, setNewUserModal ] = useState(false);
    const [ newRoleModal, setNewRoleModal ] = useState(false);

    const handleManage = (user) => {
        setSelectedUser(user);
    };

    const handleManageRole = (role) => {
        setSelectedRole(role)
    }

    const handleCloseModal = () => {
        if (selected === "User") setSelectedUser(null);
        else if (selected === "Role") setSelectedRole(null);
    };

    const openCreateModal = () => {
        if (selected === "User") setNewUserModal(true)
        else if (selected === "Role") setNewRoleModal(true)
    }

    const closeCreateModal = () => {
        if (selected === "User") setNewUserModal(false)
        else if (selected === "Role") setNewRoleModal(false)
    }

    const getUsers = async () => {
        try {
            const user = await getUser();
            setUsers(user)
        } catch (error) {
            console.error(error);
        }
    }

    const getRoles = async () => {
        try {
            const role = await getRole();
            setRoles(role)
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleCreateUser = async ( user ) => {
        try {
            const response = await createUser(user)
            console.log(response)
        } catch (error) {
            console.error(error)
        }

        closeCreateModal()
        window.location.reload();
    }

    const handleDeleteUser = async (user) => {

        try {
            const response = await removeUser(user);
            console.log(response)
        } catch(error) {
            console.error(error)
        }

        handleCloseModal();
        window.location.reload();
    }

    const handleSaveRoles = async (user, toAdd, toRemove) => {
        console.log("User" + user)
        console.log("To Add" + toAdd)
        console.log("To Remove" + toRemove)

        try {
            for (const role of toRemove) {
                const response = await removeRole(user.user, role.toLowerCase());
                console.log(response);
            }

            for (const role of toAdd) {
                const response = await assignRole(user.user, role.toLowerCase());
                console.log(response);
            }    

        } catch (error) {
            console.error(error)
        }

        handleCloseModal();
        window.location.reload();
    };

    const handleSaveRolePerms = async (diff) => {

        // NIS BRO TVER AXIOS HAV API MOA (BER WRITE api.js KAN TAH EMM)
        console.log("Saving changes:");
        console.log("Added Tables:", diff.addedTables);
        console.log("Removed Tables:", diff.removedTables);
        console.log("Permission Changes:", diff.permissionChanges);

    }

    const handleCreateRole = async (role) => {
        try {
            const response = await createRole(role)
            console.log(response)
        } catch (error) {
            console.error(error)
        }

        closeCreateModal()
        window.location.reload();
    }

    const handleDeleteRole = async (role) => {

        // TVER HAV DELETE ROLE OY MUY PG (ah ng role object jg yg brer role.role)
        handleCloseModal()
    }

    useEffect(() => {

        getUsers();
        getRoles();
    }, []);

    return(
        <div className="flex flex-col gap-4 h-full py-4">
            <div className="flex gap-4 mx-4">
                {navItems.map((nav, index) => (
                    <button className={`border border-gray-500 px-4 py-1 rounded-lg 
                                    hover:bg-slate-500 hover:text-zinc-800
                                    ${selected === nav ? `bg-blue-600` : `bg-black`}`}
                            onClick={() => {setSelected(nav)}}
                            key={index}
                    > {nav}
                    </button>
                ))}
            </div>
            <div className="h-0.5 w-full bg-zinc-800 "></div>
            <div className="mt-2 mx-4">
                <button className="border border-gray-500 px-4 py-1 rounded-lg bg-gray-800"
                        onClick={() => openCreateModal()}
                > Create {selected}
                </button>
                {/* <h1>{ status }</h1> */}
            </div>
            <div className="overflow-x-auto mx-4">
                {selected === "User" ? (
                    <table className="min-w-full bg-white shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {users.map((user, idx) => (
                            <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{user.user}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 flex justify-end">
                                    <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                        onClick={() => handleManage(user)}
                                    > Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="min-w-full bg-white shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {roles.map((role, idx) => (
                            <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-600">{role.role}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 flex justify-end">
                                    <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                        onClick={() => handleManageRole(role)}
                                    > Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <UserModal user={selectedUser}
                       roles={roles}
                       isOpen={selectedUser}
                       onClose={handleCloseModal}
                       onSaveRoles={handleSaveRoles}
                       onDelete={(user) => handleDeleteUser(user)}
            />
            <RoleModal role={selectedRole}
                       isOpened={selectedRole}
                       onClosed={handleCloseModal}
                       onDelete={(role) => handleDeleteRole(role)}
                       onSave={(diff) => handleSaveRolePerms(diff)}
            />
            <NewUserModal isOpened={newUserModal}
                          onClose={closeCreateModal}
                          onCreateUser={(user) => {
                              handleCreateUser(user)
                          }}
            />
            <NewRoleModal isOpened={newRoleModal}
                          onClose={closeCreateModal}
                          onCreateRole={(role) => {
                              handleCreateRole(role)
                          }}
            />
                    {/* <div className="flex flex-col gap-4">
                        {selected === "User" && 
                        USERS.map((user, index) => (
                            <h1 className="gap-2">Name: {user.name} AS {user.role}</h1>
                        ))}
                        {selected === "Role" &&
                        ROLES.map((role, index) => (
                            <h1 className="gap-2">{role.role}</h1>
                        ))}
                    </div> */}
        </div>
    )
}

export default Body