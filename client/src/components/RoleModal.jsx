import { useEffect, useState } from "react";

const RoleModal = ({ role, isOpened, onClosed, onDelete, onSave }) => {
    const permissions = ["ALTER", "CREATE", "DELETE", "DROP", "INSERT", "SELECT", "UPDATE"];
    const tables = ["categories", "customers", "developers", "reviews", "softwares", "transactions"];

    const [localTables, setLocalTables] = useState([]);
    const [originalTables, setOriginalTables] = useState([]);

    const [localPerms, setLocalPerms] = useState([]);
    const [originalPerms, setOriginalPerms] = useState([]);

    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (!role?.tables || hasInitialized) return;

        const tableNames = role.tables.map(item => {
            const match = item.table.match(/`[^`]+`\.`([^`]+)`/);
            return match ? match[1] : item.table;
        });

        setLocalTables([]);
        setOriginalTables([]);

        const allPerms = new Set();
        role.tables.forEach(item => {
            item.permissions?.forEach(p => allPerms.add(p));
        });

        const uniquePerms = Array.from(allPerms);
        setLocalPerms([]);
        setOriginalPerms([]);

        setHasInitialized(true);
    }, [role, hasInitialized]);

    if (!isOpened) return null;

    const handleTableToggle = (table) => {
        const isChecked = localTables.includes(table);
        const updatedTables = isChecked
            ? localTables.filter(t => t !== table)
            : [...localTables, table];

        setLocalTables(updatedTables);
    };

    const handlePermissionToggle = (permission) => {
        setLocalPerms(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    const getDiff = () => {
        const addedTables = localTables.filter(t => !originalTables.includes(t));
        const removedTables = originalTables.filter(t => !localTables.includes(t));

        const original = new Set(originalPerms || []);
        const current = new Set(localPerms || []);

        const addedPerms = [...current].filter(p => !original.has(p));
        const removedPerms = [...original].filter(p => !current.has(p));

        return {
            addedTables,
            removedTables,
            permissionChanges: {
                added: addedPerms,
                removed: removedPerms
            }
        };
    };

    const handleSave = () => {
        const diff = getDiff();
        onSave(diff)
        onClosed()
    } 

    const handleDelete = () => {
        onDelete(role)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">
                    Manage Role
                    <input type="text"
                            className="w-full mt-4 p-2 border border-gray-300 rounded font-normal text-base"
                            value={role?.role || ""}
                            readOnly
                    />
                </h2>
                <h3>
                    Privilige
                </h3>
                {role.tables.map((item, idx) => {
                const match = item.table.match(/`[^`]+`\.`([^`]+)`/);
                const tableName = match ? match[1] : item.table;

                return (
                    <div key={idx} className="flex justify-between items-center text-sm border-b py-1">
                    <div className="">{item.permissions.join(", ")}</div>
                    <div className="">{tableName}</div>
                    <button
                        className="text-xs text-red-600 hover:underline"
                        onClick={() => {}}
                    >
                        Delete
                    </button>
                    </div>
                );
                })}
                <div>
                    <h1 className="my-2 font-semibold">Tables:</h1>
                    {tables.map(table => (
                        <label key={table} className="flex items-center gap-2">
                            <input type="checkbox"
                                   checked={localTables.includes(table)}
                                   onChange={() => handleTableToggle(table)}
                            />
                            <span>{table}</span>
                        </label>
                    ))}

                    <h1 className="my-2 font-semibold">Permissions:</h1>
                    {permissions.map(permission => (
                        <label key={permission} className="flex items-center gap-2">
                            <input type="checkbox"
                                checked={localPerms.includes(permission)}
                                onChange={() => handlePermissionToggle(permission)}
                                disabled={localTables.length === 0}
                            />
                            <span>{permission}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-between items-center space-x-2 mt-6">
                    <button className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                            onClick={onClosed}
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => handleDelete()}
                    >
                        Delete User
                    </button>
                    <button onClick={() => handleSave()}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleModal;
