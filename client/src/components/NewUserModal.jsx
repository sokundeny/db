import React, { useState } from 'react';

const CreateUserModal = ({ isOpened, onClose, onCreateUser }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (!name || !password) {
            alert('Please fill in both fields');
            return;
        }
        onCreateUser({ name, password });

        setName('');
        setPassword('');
    };

    if (!isOpened) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-30">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">Create User</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded shadow-sm"
                            placeholder="Enter username"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded shadow-sm"
                            placeholder="Enter password"
                    />
                </div>

                <div className="flex justify-between items-center space-x-2">
                    <button className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
                            onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleSubmit}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;
