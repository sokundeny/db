import { useState, useEffect } from "react";

const UpdateRoleModal = ({ isOpen, onClose, onUpdate, role }) => {
  const [newRoleName, setNewRoleName] = useState("");

  useEffect(() => {
    if (role) {
      setNewRoleName(role.role); // prefill with current role name
    }
  }, [role]);

  const handleSubmit = () => {
    if (!newRoleName) {
      alert("Role name is required");
      return;
    }
    onUpdate(role.role, newRoleName); // old role, new role
    onClose();
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Update Role</h2>

        <label className="block text-sm font-medium">New Role Name</label>
        <input
          type="text"
          className="w-full mt-1 p-2 border border-gray-300 rounded"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="Enter new role name"
          autoFocus
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoleModal;
