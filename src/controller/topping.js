
const { topping }=require('../../models/index');
const path=require('path');
const fs=require('fs');

exports.addToping = async (req, res) => {

    try{
        const data=req.body;
        let result=await topping.create({
            ...data,
            image: req.file.filename,
        });
        
        result = JSON.parse(JSON.stringify(result))

        result = {
            ...result,
            image: process.env.FILE_PATH + result.image
        }
        
        res.send({
            status: "success",
            data: result
        })

    } catch(err){
        console.log(err);
        res.send({
            error: err
        })
    }
}

exports.getToppings = async (req, res) => {
    try{

        let result=await topping.findAll({
            attributes: {
                exclude: ['createdAt','updatedAt','password']
            }
        })

        result=JSON.parse(JSON.stringify(result))//to overwrite image in data

        // console.log(result[0].image);

        result.map( data =>data.image=process.env.FILE_PATH+data.image);

        res.send({
            status: "success",
            data: {
                products: result
            }
        })

    } catch(err){
        console.log(err);
        res.send({
            error: err
        })
    }
}

exports.getDetailTopping = async (req, res) => {
    try{

        let result=await topping.findOne({
            where: {
                id: req.params.id
            }, attributes: {
                exclude: ['createdAt','updatedAt','password']
            }
        })

        result=JSON.parse(JSON.stringify(result))//to overwrite image in data
        result.image=process.env.FILE_PATH+result.image

        res.send({
            status: "success",
            data: {
                product: result
            }
        })

    } catch(err){
        console.log(err);
        res.send({
            error: err
        })
    }
} 

exports.changeToping = async (req, res) => {
    try{

        let data =req.body;
        
        let{ image } = await topping.findOne({
            where: {
                id: req.params.id
            }
        })

        image=path.join(__dirname,'../../uploads',image)
        fs.unlink(image,(err)=>console.log(err))

        data = await topping.update(      
            {...data,
                image: req.file.filename
            },
            {
            where: {
                id: req.params.id
            }
        })

        let result= await topping.findOne({
            where: {
                id: req.params.id
            },attributes: {
                exclude: ['createdAt','updatedAt']
            }
        })
        result = JSON.parse(JSON.stringify(result))
        result = {
            ...result,
            image: process.env.FILE_PATH + result.image
        }

        res.send({
            status: "succes",
            data: {
                topping: result
            }
        })

    } catch(err){
        console.log(err);
        res.send({
            error: err
        })
    }
}

exports.deleteToping= async (req, res) => {
    try{

        let{ image } = await topping.findOne({
            where: {
                id: req.params.id
            }
        })

        image=path.join(__dirname,'../../uploads',image)
        fs.unlink(image,(err)=>console.log((err)));
        
        await topping.destroy({
            where: {
                id: req.params.id
            }
        })

        res.send({
            status: "success",
            data: {
                id: req.params.id
            }
        })

    } catch(err){
        console.log(err);
        res.send({
            error: err
        })
    }
}