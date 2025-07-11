import { useEffect, useState } from "react";

const UserModal = ({ user, roles, isOpen, onClose, onSaveRoles, onDelete }) => {
    const [localRoles, setLocalRoles] = useState([]);

    useEffect(() => {
        // If user.roles is array of { role, is_admin_option }
        setLocalRoles(user?.roles || []);
    }, [user]);

    if (!isOpen) return null;

    // Toggle role selection
    const toggleRole = (roleName) => {
        setLocalRoles((prev) => {
            const found = prev.find(r => r.role === roleName);
            if (found) {
                return prev.filter(r => r.role !== roleName);
            } else {
                return [...prev, { role: roleName, is_admin_option: false }];
            }
        });
    };

    // Toggle admin option for a role
    const toggleAdminOption = (roleName) => {
        setLocalRoles((prev) =>
            prev.map(r =>
                r.role === roleName ? { ...r, is_admin_option: !r.is_admin_option } : r
            )
        );
    };

    const handleSave = () => {
        const original = new Map((user?.roles || []).map(r => [r.role, r.is_admin_option]));
        const updated = new Map(localRoles.map(r => [r.role, r.is_admin_option]));

        const toAdd = [];
        const toRemove = [];

        for (const [role, isAdmin] of updated) {
            if (!original.has(role) || original.get(role) !== isAdmin) {
                toAdd.push({ role, is_admin_option: isAdmin });
            }
        }

        for (const [role] of original) {
            if (!updated.has(role)) {
                toRemove.push(role);
            }
        }

        onSaveRoles(user, toAdd, toRemove); // Make sure this gets called!
        onClose();
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">
                    Manage User
                    <input
                        type="text"
                        className="w-full mt-4 p-2 border border-gray-300 rounded font-normal text-base"
                        value={user.user}
                        readOnly
                    />
                </h2>
                <h2 className="mb-2 font-medium">Roles</h2>

                <div className="space-y-3 mb-6">
                    {roles.map(({ role }) => {
                        const isChecked = localRoles.some(r => r.role === role.toUpperCase());
                        const isAdmin = localRoles.find(r => r.role === role.toUpperCase())?.is_admin_option || false;

                        return (
                            <div key={role} className="flex flex-col gap-1 border rounded p-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleRole(role.toUpperCase())}
                                    />
                                    <span>{role.toUpperCase()}</span>
                                </label>
                                {isChecked && (
                                    <label className="flex items-center gap-2 text-sm text-blue-700 pl-6">
                                        <input
                                            type="checkbox"
                                            checked={isAdmin}
                                            onChange={() => toggleAdminOption(role.toUpperCase())}
                                        />
                                        <span>Admin Option</span>
                                    </label>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-between items-center space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDelete(user)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete Role
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
