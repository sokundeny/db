import { useState } from "react";

const NewRoleModal = ({ isOpened, onClose, onCreateRole }) => {
    const [role, setRole] = useState('');
    const permissions = ["ALTER", "CREATE", "DELETE", "DROP", "INSERT", "SELECT", "UPDATE"]
    const tables = ["categories", "customers", "developers", "reviews", "softwares", "transactions"]
    const [ localPerms, setLocalPerms ] = useState([])
    const [ localTables, setLocalTables ] = useState([])

    const togglePermission = (perm) => {
        setLocalPerms(prev => 
            prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
        )
    }

    const toggleTable = (table) => {
        setLocalTables(prev => 
            prev.includes(table) ? prev.filter(t => t !== table) : [...prev, table]
        )
    }
    const onSubmit = () => {
        onCreateRole({ role, localPerms, localTables })

        setRole('')
        setLocalPerms([])
        setLocalTables([])
    }

    if (!isOpened) return null

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">Create Role</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border rounded shadow-sm"
                        placeholder="Enter role"
                    />
                </div>

                <h2 className="font-semibold">Tables</h2>
                <div className="space-y-2 mb-6">
                    {tables.map((table, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                onChange={() => toggleTable(table)}
                            />
                            <span>{table}</span>
                        </label>
                    ))}
                </div>

                <h2 className="font-semibold">Permissions</h2>
                <div className="space-y-2 mb-6">
                    {permissions.map((permission, index) => (
                        <label key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                onChange={() => togglePermission(permission)}
                            />
                            <span>{permission}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-between items-center space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewRoleModal