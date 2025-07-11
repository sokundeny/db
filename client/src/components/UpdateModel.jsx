import { useState, useEffect } from "react";

const UpdateUserModal = ({ isOpen, onClose, onUpdate, user }) => {
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setNewName(user.user); // prefill with current username
      setNewPassword("");     // don't prefill password
    }
  }, [user]);

  const handleSubmit = () => {
    if (!newName) {
      alert("Username is required");
      return;
    }
    onUpdate(user.user, newName, newPassword); // old name, new name, new password
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Update User</h2>

        <label className="block text-sm font-medium">New Username</label>
        <input
          type="text"
          className="w-full mt-1 p-2 border border-gray-300 rounded"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <label className="block text-sm font-medium mt-4">New Password</label>
        <input
          type="password"
          className="w-full mt-1 p-2 border border-gray-300 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Leave blank to keep current password"
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

export default UpdateUserModal;
