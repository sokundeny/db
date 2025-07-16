import { useEffect, useState } from "react";

const RoleModal = ({ role, isOpened, onClosed, onGrant, onRevoke, onDeleteRole, onUpdate }) => {

    const [ localRole, setLocalRole ] = useState(role);
    const permissions = ["ALTER", "CREATE", "DELETE", "DROP", "INSERT", "SELECT", "UPDATE"];
    const tables = ["categories", "customers", "developer", "reviews", "software", "transactions"];

    const [localTables, setLocalTables] = useState([]);
    const [localPerms, setLocalPerms] = useState([]);

    useEffect(() => {
        if (isOpened && role?.role) {
            setLocalRole(role);
            setLocalTables([]);
            setLocalPerms([]);
        }
    }, [isOpened, role?.role]);

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

    const handleRevokePermission = (name, perms) => { 
        const tablesArray = [name];             
        onRevoke(role.role, tablesArray, perms);
        setLocalRole({
            ...localRole,
            tables: localRole.tables.filter(item => {
                const match = item.table.match(/`[^`]+`\.`([^`]+)`/);
                const tableName = match ? match[1] : item.table;
                return tableName !== name;
            }),
        });
    }

    const handleGrantPermission = () => {
        onGrant(role.role, localPerms, localTables)

        const updatedTables = [...localRole.tables];

        localTables.forEach(table => {
            const formattedTable = `\`your_db\`.\`${table}\``;
            const existing = updatedTables.find(t => {
                const match = t.table.match(/`[^`]+`\.`([^`]+)`/);
                const tableName = match ? match[1] : t.table;
                return tableName === table;
            });

            if (existing) {
                const mergedPerms = Array.from(new Set([...existing.permissions, ...localPerms]));
                existing.permissions = mergedPerms;
            } else {
                updatedTables.push({
                    table: formattedTable,
                    permissions: localPerms,
                });
            }
        });

        setLocalRole({
            ...localRole,
            tables: updatedTables,
        });

        setLocalPerms([])
        setLocalTables([])

    }

    const handleSubmit = () => {
        if (!localRole.role) {
            alert("Role name is required");
        }
        else {
            onUpdate(role.role, localRole.role)
            alert("Role name updated successfully");
        }

        onClosed()
    }
    
    const handleDelete = () => {
        onDeleteRole(role)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">
                    Manage Role
                    <div className="flex gap-2 mt-2">
                        <input type="text"
                                className="w-full p-2 border border-gray-300 rounded font-normal text-base"
                                value={localRole?.role || ""}
                                    onChange={e => setLocalRole({
                                        ...localRole,
                                        role: e.target.value
                                    })
                                }
                        />
                        <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => handleSubmit()}
                            > Save
                        </button>
                    </div>
                </h2>
                <h3>
                    Privilige
                </h3>
                <h1>{localRole?.tables && localRole.tables.length > 0 ? '' : 'No Previllege'}</h1>
                {localRole?.tables.map((item, idx) => {
                    const match = item.table.match(/`[^`]+`\.`([^`]+)`/);
                    const tableName = match ? match[1] : item.table;

                    return (
                        <div key={idx} className="flex justify-between items-center text-sm border-b py-1">
                            <div className="w-56">{item.permissions.join(", ")}</div>
                            <div className="">{tableName}</div>
                            <button
                                className="text-xs text-red-600 hover:underline"
                                onClick={() => handleRevokePermission(tableName, item.permissions)}
                            >
                                Delete
                            </button>
                        </div>
                    );
                })}
                <div className="mt-4">
                    <div className="w-full flex justify-between">
                        <h1 className="text-xl font-semibold">Grant New Privilige</h1>
                    </div>
                    <div className="w-full flex justify-between pr-4">
                        <div className="">
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
                        </div>
                        
                        <div>
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
                    </div>
                </div>

                <div className="flex justify-between items-center space-x-2 mt-6">
                    <button className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                            onClick={onClosed}
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => handleDelete()}
                    >
                        Delete Role
                    </button>
                    <button onClick={() => handleGrantPermission()}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Grant Previlige
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleModal;
