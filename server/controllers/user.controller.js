import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'

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

export async function verifyEmailController(request,response){
    try {
        const {code} = request.body
        const user = await UserModel.findOne({_id:code})
        if(!user){
            return response.status(400).json({
                message: "Invalid code",
                error: true,
                success: false
            })
        }
        const updateUser = await UserModel.updateOne({_id: code}, { 
            verify_email: true
        })

        return response.json({
            message: "Account verification process completed.",
            success : true,
            error: false
        })

    } catch (error) {
        request.response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//Login 
export async function loginController(request,response){
    try {
        const { email , password } = request.body


        if(!email || !password){
            return response.status(400).json({
                message : "provide correct email & password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Your account is not registered",
                error : true,
                success : false
            })
        }
        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Please connect with the Admin",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Please check your password",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({
            message : "You have logged in successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//Logout
export async function logoutController(request,response){
    try {
        const userid = request.userId 

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return response.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}