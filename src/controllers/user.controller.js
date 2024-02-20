import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req, res) => {
    //take data from user through frontend
    //validation - not empty or in wrong format
    //check if user already exists: username and email
    //check for images, check for avatar
    //upload the user avatar in  (cloudinary)
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation 
    //return response


    const {fullname, email, username, password } = req.body

    const arrayrequired = [fullname, email, username, password]

    if(arrayrequired.some((field) => {
            (field?.trim() === "") }) ){
        throw new ApiError(400, "All field are required")
    }

    if(!(arrayrequired[1].includes("@"))){
        throw new ApiError(400, "incorrect email format")   
     }
     
     const existedUser = await User.findOne({
        $or: [
            { username }, { email } 
        ]
    });
  
    if(existedUser){
        throw new ApiError(409, "User with email or Username already exists")
    }

   const avatarLocalPath = req.files?.avatar?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required")
   }
    
      const avatar =  await uploadOnCloudinary(avatarLocalPath)
      const coverImage = await uploadOnCloudinary(coverImageLocalPath)


      if(!avatar){
        throw new ApiError(400, "Avatar file is required")
      }
    

     const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
      })

      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
      )

      if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the User")
      }

       
      return res.status(201).json(
        new ApiResponse(200 , createdUser , "User Registered Successfully")
      )




})




export {registerUser}

