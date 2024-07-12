import {redis} from "../app.js"
export const getCachedData = (key)=> async (req,res,next)=>{
  let product = await redis.get(key)
  if(product){
    return res.json({
      product:JSON.parse(product)
    })
  }
  next()
}
