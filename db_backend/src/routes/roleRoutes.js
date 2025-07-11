import express from 'express'
import { createRole, deleteRole, getAllRole, grantRole, revokeRole, updateRole } from '../controller/roleController.js'

const roleRouter = express.Router()

roleRouter.get('/', getAllRole)

roleRouter.post('/', createRole)
roleRouter.post('/grant', grantRole)

roleRouter.put('/',updateRole)

roleRouter.delete('/', deleteRole)
roleRouter.delete('/revoke', revokeRole)

export default roleRouter