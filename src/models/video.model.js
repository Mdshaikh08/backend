import mongoose , {Schema} from "mongoose"
const videoSchema = new Schema(
    {
    thumbnail:{
        type: String,
        required : true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
       type: String,
       required: true,
    },
    duration:{
     type:Number,
     required: true
    },
    views:{
        type:Number,
        default: 0
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref : "User"
    }
    
} ,
{
    timestamps:true
}

)
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.models("Videos" , videoSchema)