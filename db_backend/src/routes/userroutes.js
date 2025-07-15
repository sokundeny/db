import express from 'express'
import { getAllUser, createUser, assignRole, deleteUser, removeRole, updateUser, grantPrivilege, revokeUser } from '../controller/usercontroller.js'

const userRouter = express.Router()

userRouter.get('/', getAllUser)
userRouter.get('/health', (req, res) => {
    res.json({ message: "User API is working!" });
})

userRouter.post('/', createUser)
userRouter.post('/role', assignRole)
userRouter.post('/grant', grantPrivilege)



userRouter.put('/',updateUser)

userRouter.delete('/', deleteUser)
userRouter.delete('/role', removeRole)
userRouter.delete('/revoke', revokeUser)


export default userRouter