import { useEffect, useState } from "react";

const UserModal = ({ user, roles, isOpen, onClose, onSaveRoles, onRevokeRole }) => {

    const [ localRoles, setLocalRoles ] = useState([]);
    useEffect(() => {
        setLocalRoles([user?.role] || []); 
    }, [user]);

    if (!isOpen) return null;

    const toggleRole = (role) => {
        console.log(localRoles)
        setLocalRoles(prev => 
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        )
    }

    const handleSave = () => {
        const original = new Set([user?.role] || []);
        const updated = new Set(localRoles);

        const toAdd = [...updated].filter((r) => !original.has(r))
        const toRemove = [...original].filter((r) => !updated.has(r))

        onSaveRoles(user, toAdd, toRemove);
        onClose();
    }

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">
                    Manage User
                    
                    <input type="text" 
                        className="w-full mt-4 p-2 border border-gray-300 rounded font-normal text-base"
                        value={user.user}
                    />
                </h2>
                <h2>Roles</h2>

                <div className="space-y-2 mb-6">
                    {roles.map(role => (
                        <label key={role.role} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={localRoles.includes(role.role.toUpperCase())}
                                onChange={() => toggleRole(role.role.toUpperCase())}
                            />
                            <span>{role.role}</span>
                        </label>
                    ))}
                </div>
                {/* <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Role:
                    </label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div> */}

                <div className="flex justify-between items-center space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onRevokeRole(user)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete User
                    </button>
                    <button
                        onClick={() => handleSave()}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserModal