const mongoose = require('mongoose');
const { sendResponse, AppError}=require("../helpers/utils.js");
const Car = require('../models/Car');
const carController = {};

carController.createCar = async (req, res, next) => {
    let {make,model,release_date,transmission_type,size,style,price} = req.body;
    try{
    if(!make || !model || !release_date || !transmission_type || !size || !style || !price) throw new AppError(400,"Bad Request","Missing body info")
        const data = {make,model,release_date,transmission_type,size,style,price}
        const created= await Car.create(data)
        sendResponse(res,200,true,created,null,"Create Car  Success")
    }catch(err){
        next(err)
    }
};

carController.getCars = async (req, res, next) => {
    const allowedFilter = [
        "page"
      ];
      try{
        let { page,...filterQuery } = req.query;
        const filterKeys = Object.keys(filterQuery);
        filterKeys.forEach((key) => {
        if (!allowedFilter.includes(key)) throw new AppError(401,"Bad Request",`Query ${key} is not allowed`) 
            if (!filterQuery[key]) delete filterQuery[key];
        });
        page = parseInt(page) || 0;
        const listOfFound= await Car.find().limit(10).skip(10*page)
        sendResponse(res,200,true,listOfFound,null,"Found list of cars success")
    }catch(err){
        next(err)
    }
};

carController.editCar = async (req, res, next) => {
    const options = {new:true}
    try{
        const allowUpdate= [ "make","model","release_date","ransmission_typ","size","style","price"]
        const targetId =req.params.id
		console.log(targetId)
        const updateInfo=req.body
        const updateKeys=Object.keys(updateInfo)
        const notAllow = updateKeys.filter(el=>!allowUpdate.includes(el));
        if(notAllow.length)throw new AppError(401,"Bad Request","Update field not allow")
        const updated= await Car.findByIdAndUpdate(targetId,updateInfo,options)
        if(!updated) throw new AppError(404,"Bad Request","car not found")
        sendResponse(res,200,true,updated,null,"Update Car success")
    }catch(err){
        next(err)
    }
};

carController.deleteCar = async (req, res, next) => {
    const targetId = req.params.id
    const deleted = {isDeleted:true}
    const options = {new:true}
    try{
        const updated= await Car.findByIdAndUpdate(targetId,deleted,options)
        if(!updated) throw new AppError(404,"Bad Request","car not found")
        sendResponse(res,200,true,updated,null,"Delete car success")
    }catch(err){
        next(err)
    }
};

module.exports = carController;
