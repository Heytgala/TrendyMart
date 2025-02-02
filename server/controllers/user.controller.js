import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'

export async function registerUserController(request,response) {
    try {
        const {name, email, password } = request.body
        if(!name || !email || !password){
            return response.status(400).json({
                message: 'Please add necessary fields',
                error: true,
                success: false
            })
        }
        const user = await UserModel.findOne({email})
        if(user){
            return response.json({
                message: "User is already registered",
                error: true,
                success: false
            })
        }
        const salt= await bcryptjs.genSalt(10)
        const hashPassword= await bcryptjs.hash(password,salt)

        const payLoad={
            name, email, password: hashPassword
        }

        const newUser= new UserModel(payLoad)
        const save = await newUser.save()

        const VerifyEmailURL= `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verification Email from TrendyMart",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailURL
            })
        })

        return response.json({
            message:"User Account created successfully",
            error: false,
            success:true,
            data: save
        })

    } catch (error) {
        request.response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    
}