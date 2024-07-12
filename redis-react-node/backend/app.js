import express from 'express'
import { getProductDetail, getProducts } from './products.js'
import Redis from 'ioredis'
import { getCachedData } from './middleware/redis.js'

export const redis = new Redis({
  host:"127.0.0.1",
  port:6379,
})
redis.on('connect',()=>{
  console.log("Redis connected")
})
const app = express()
app.get("/",(req,res)=>{
  res.send("Hello world")
})
app.get("/getProducts",getCachedData("products"),async (req,res)=>{

  const products = await getProducts()
  // await redis.set("products",JSON.stringify(products.products))
  await redis.setex("products",20,JSON.stringify(products.products))
  res.json({products})

})
app.get("/getProducts/:id",async(req,res)=>{
  const id = req.params.id
  const key = `product:${id}`
  product = await getProductDetail(id);
  await redis.set(`product:${id}`,JSON.stringify(product))
  res.json({
    product
  })
})
app.get("/order/:id",async(req,res)=>{
  const productId = req.params.id;
  const key = `product:${productId}`
  await redis.del(key)
  return res.json({
    message:`order places successfully,productId:${productId}  is ordered`
  })
})



app.listen(3000,()=>{
  console.log("Listening on port 3000")
})
