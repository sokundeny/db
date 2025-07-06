import express from 'express'
import { createRole, deleteRole, getAllRole, grantRole, revokeRole } from '../controller/roleController.js'

const roleRouter = express.Router()

roleRouter.get('/', getAllRole)

roleRouter.post('/', createRole)
roleRouter.post('/grant', grantRole)

roleRouter.delete('/', deleteRole)
roleRouter.delete('/revoke', revokeRole)

export default roleRouter