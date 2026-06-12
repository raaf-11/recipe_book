const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { db } = require('../database')

const JWT_SECRET='recipebook_secret_key_2024'

router.post('/register',(req,res)=>{
    const {name,email,password}=req.body
    
    if(!name|| !email|| !password){
        return res.status(400).json({
            error: 'All fields are required'
        })
    }
    if(password.length<8){
        return res.status(400).json({error:'Password must be atleast 8 characters'})

    }


    const existingUser=db.prepare('SELECT id FROM users WHERE email=?').get(email)
    if(existingUser){
        return res.status(400).json({
            error:'Email already registered'
        })
    }

    const hashedPassword=bcrypt.hashSync(password,10)

    const result=db.prepare('INSERT INTO users (name,email,password) VALUES (?,?,?)')
    .run(name,email,hashedPassword)

    const token=jwt.sign({
        id: result.lastInsertRowid,
        name,
        email
    },JWT_SECRET,{expiresIn:'7d'}
       
    )

    res.status(201).json({
        token,
        user:{ id:result.lastInsertRowid,name,email}
    })

})

router.post('/login',(req,res)=> {
    const {email,password} = req.body

    if(!email || !password){
        return res.status(400).json({error:'All fields are required'})
    }

    const user=db.prepare('SELECT * FROM users WHERE email=?').get(email)
    if(!user){
        return res.status(401).json({error:'Invalid email or password'})
    }

    const passwordMatch=bcrypt.compareSync(password,user.password)
    if(!passwordMatch){
        return res.status(401).json({error: 'Invalid email or password'})
    }
     const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  })
})

module.exports=router