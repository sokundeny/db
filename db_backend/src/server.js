import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRouter from './routes/userroutes.js'
import roleRouter from './routes/roleRoutes.js'
import { serveSwagger,setupSwagger } from './configs/swagger.js'

const app=express()
const port= process.env.PORT 

app.use(express.json())
app.use(cors())

app.use('/docs', serveSwagger, setupSwagger);

app.use('/api/user',userRouter)
app.use('/api/role',roleRouter)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})