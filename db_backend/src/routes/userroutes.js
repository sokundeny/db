import express from 'express'
import { getAllUser,createUser,assignRole,deleteUser,removeRole } from '../controller/usercontroller.js'

const userRouter=express.Router()

userRouter.get('/',getAllUser)

userRouter.post('/',createUser)
userRouter.post('/role',assignRole)

userRouter.delete('/',deleteUser)
userRouter.delete('/role',removeRole)

export default userRouter