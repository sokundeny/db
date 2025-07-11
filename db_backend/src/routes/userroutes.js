import express from 'express'
import { getAllUser, createUser, assignRole, deleteUser, removeRole, updateUser } from '../controller/usercontroller.js'

const userRouter = express.Router()

userRouter.get('/', getAllUser)
userRouter.get('/health', (req, res) => {
    res.json({ message: "User API is working!" });
})

userRouter.post('/', createUser)
userRouter.post('/role', assignRole)

userRouter.put('/',updateUser)

userRouter.delete('/', deleteUser)
userRouter.delete('/role', removeRole)

export default userRouter