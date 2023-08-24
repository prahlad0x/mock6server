const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { connection } = require('./db')
const { userRouter } = require('./routes/user.route')
const { appointmentRouter } = require('./routes/appointment')


const app =express()

app.use(express.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.send({msg : "welcome to our hospital management system."})
})

app.use('/users', userRouter)
app.use('/appointment', appointmentRouter)

app.listen(Number(process.env.port), async(req,res)=>{
    try {
        await connection
        console.log("connected to database")
    } catch (error) {
        console.log(error)
    }

    console.log('Server is running...')
})