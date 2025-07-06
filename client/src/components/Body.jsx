import { useState } from "react"
import { pingUser, getUser, getRole, assignRole, removeRole } from "../api"
import { useEffect } from "react"
import UserModal from "./UserModal"
import NewUserModal from "./NewUserModal"

const Body = () => {
    const [ navItems, setNavItems ] = useState(["User", "Role"]);
    const [ selected, setSelected ] = useState("User")
    const [ users, setUsers ] = useState([]);
    const [ roles, setRoles ] = useState([]);
    const [ selectedUser, setSelectedUser ] = useState(null);
    const [ newUserModal, setNewUserModal ] = useState(false);

    const handleManage = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const openNewUserModal = () => {
        setNewUserModal(true)
    }

    const closeNewUserModal = () => {
        setNewUserModal(false)
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

        // setUsers(users.map(u =>
        // u.username === user.username ? { ...u, role: newRole } : u
        // ));
        handleCloseModal();

    };

    const handleRevokeRole = (user) => {
        // setUsers(users.map(u =>
        // u.username === user.username ? { ...u, role: 'viewer' } : u
        // ));
        handleCloseModal();
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                const user = await getUser();
                setUsers(user)
                console.log(user)
            } catch (error) {
                console.error(error);
            }
        }

        const getRoles = async () => {
            try {
                const role = await getRole();
                setRoles(role)
                console.log(role)
            } catch (error) {
                console.error(error);
            }
        }

        getUsers();
        getRoles();
        
    }, []);

    return(
        <div className="flex flex-col gap-4 h-full">
            <div className="flex gap-4">
                {navItems.map((nav, index) => (
                    <button className={`border border-gray-500 px-4 py-1 rounded-lg 
                                    hover:bg-slate-500 hover:text-zinc-800
                                    ${selected === nav ? `bg-blue-600` : `bg-black`}`}
                            onClick={() => {setSelected(nav)}}
                            key={index}
                    >{nav}
                    </button>
                ))}
            </div>
            <div className="h-0.5 w-full bg-zinc-800"></div>
            <div className="mt-2">
                <button className="border border-gray-500 px-4 py-1 rounded-lg bg-gray-800">Create {selected}</button>
                {/* <h1>{ status }</h1> */}
            </div>
            <div className="overflow-x-auto">
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
            </div>
            <UserModal 
                user={selectedUser}
                roles={roles}
                isOpen={!selectedUser}
                onClose={handleCloseModal}
                onSaveRoles={handleSaveRoles}
                onRevokeRole={handleRevokeRole}
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