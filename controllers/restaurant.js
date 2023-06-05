// const httpStatus = require('http-status');
const restaurantService = require('../services/restaurantService');

exports.restaurantList = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.restaurantList(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: " get restaurent successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "get restaurent not successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.restaurentReviewRating = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.restaurentReviewRating(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: " get restaurent Review Rating successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "get restaurent Review Rating not successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.addRestaurentReviewRating = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.addRestaurentReviewRating(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "Restaurent Review Rating added successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "Restaurent Review Rating not added  successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.favouriteRestaurant = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.favouriteRestaurant(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "favourite Restaurant created successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "favourite Restaurant not created successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};
exports.favouriteMenuRestaurant = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.favouriteMenuRestaurant(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "favourite Restaurant menu created successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "favourite Restaurant menu not created successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.orders = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.orders(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "Restaurant orders created successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "Restaurant orders not created successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.createCard = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.createCard(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "card created successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "card already registered with us" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.cardList = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.cardList(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "get all cards successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "No cards are available " });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.orderStatus = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.orderStatus(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "get all order status successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "No order status are available " });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.createOrderProcessDetails = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.createOrderProcessDetails(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "order Process details created successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "order Process details creation not successful" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.OrderProcessDetails = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.OrderProcessDetails(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "get order Process details successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "get order Process details not successful" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.pastOrders = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.pastOrders(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "fetch past orders successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "fetch past orders not successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.pendingOrders = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.pendingOrders(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "fetch pending orders successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "fetch past orders not successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.cart = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.cart(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "fetch pending orders successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "fetch past orders not successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

exports.calculateTax = async (req, res, next) => {
    try {
        //Calling the service to create a conversation
        const result = await restaurantService.calculateTax(req.body)
        if(result)
        {
            return res.status(200).json({ success: true, status: 200, data: result, message: "fetch pending orders successfully" });
        }
        else
        {
            return res.status(200).json({ success: false, status: 200, data: result, message: "fetch past orders not successfully" });
        }
       
   
    } catch (e) {
        return res.status(400).json({ success: false, status: 400, message: e.message });
    }
};

