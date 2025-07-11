import axios from "axios"

const API_BASE_URL = "http://localhost:4000/api"

export const pingUser = async () => {
    const response = await axios.get(`${API_BASE_URL}/user/health`);
    return response.data;
}

export const createUser = async ( user ) => {
    //   const response = await axios.post(`${API_BASE_URL}/articles`, article);
    const response = await axios.post(`${API_BASE_URL}/user`, {
        name: user.name,
        password: user.password
    })
    return response.data;
};

export const getUser = async () => {
    const response = await axios.get(`${API_BASE_URL}/user`);
    return response.data;
}

export const removeUser = async (user) => {
    const response = await axios.delete(`${API_BASE_URL}/user`, {
        data: {
            name: user.user
        }
    });
  return response.data;
};

export const assignRole = async ( name, role ) => {
    console.log("Add User: " + name)
    console.log("Add Role: " + role)
    const response = await axios.post(`${API_BASE_URL}/user/role`, {
        name, 
        role,
        is_admin_option: false
    });
    return response.data;
};

export const removeRole = async ( name, role ) => {
    console.log("Remove User: " + name)
    console.log("Remove  Role: " + role)
    const response = await axios.delete(`${API_BASE_URL}/user/role`, {
        data: {
            name,
            role
        }
    });
    return response.data;
}

export const getRole = async () => {
    const response = await axios.get(`${API_BASE_URL}/role`);
    return response.data;
}

export const createRole = async ( role ) => {
    const response = await axios.post(`${API_BASE_URL}/role`, {
        role: role.role,
        permissions: role.localPerms,
        table: role.localTables
    })
    return response.data;
};

export const deleteRole = async () => {
    const response = await axios.delete(`${API_BASE_URL}/role`, {
        data: {
            role: ""
        }
    });
  return response.data;
};

// export const updateArticle = async (id, updatedData) => {
//   const response = await axios.put(`${API_BASE_URL}/articles/${id}`, updatedData);
//   return response.data;
// };

// export const removeArticle = async (id) => {
//   const response = await axios.delete(`${API_BASE_URL}/articles/${id}`);
//   return response.data;
// };
