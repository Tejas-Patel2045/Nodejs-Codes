const models = require("../models");
const restaurentFavour = models.restaurentFavour;
const restaurantOffer = models.restaurantOffer;
const restaurentRating = models.restaurentRating;
const orders = models.orders;
const orderDetails = models.orderDetails;
const orderPaymentDetails = models.orderPaymentDetails;
const restaurantMenuFavour = models.restaurantMenuFavour;
const cardDetails = models.cardDetails;
const orderProcessDetails = models.orderProcessDetails;
const cart = models.cart;
const cartItem = models.cartItem;
const cartAddOn = models.cartAddOn;
const cartVarient = models.cartVarient;
const con = require("../configs/db");
const data = require("../configs/data.json");
const utils = require("../utilities/reusableFunctions");
const emailConfig = require("../utilities/emaillTransporter");
class restaurantService {
    static async restaurantList(payload) {
        try {
            const restaurants = await getLastSeenActivityQuery(`select r.id, r.Name, latitude, longitude, r.imageUrl, r.preparationTime,avg(rr.rating) as avgrating,
            count(rr.review) as reviewCount,r.description,r.address,r.restaurantStatusId from
                        restaurant r left join restaurentRating rr on
                        r.id=rr.restaurentId where r.restaurantStatusId=3
                        group by r.id, r.Name, latitude, longitude, r.imageUrl, r.preparationTime`);

            const restaurentsFavour = await getLastSeenActivityQuery(`SELECT id, restaurentId, customerId, favCheck FROM restaurentFavour where favCheck=1;`);
            const restaurantOfferData = await getLastSeenActivityQuery(`SELECT id, restaurantId, offerName, offerCode, discount, startDate, endDate FROM restaurantOffer where DATE(endDate) >=CURDATE()`);
            const munchMagicData = await getLastSeenActivityQuery(`SELECT id, restaurantId, offerName, promoCode as offerCode, discount, startDate, endDate FROM munchMagicOffer where DATE(endDate) >=CURDATE()`);
            const restaurantTypeData = await getLastSeenActivityQuery(`SELECT rtm.id, rtm.restaurentId, rtm.restaurentTypeId,rt.name as restaurentType  FROM restaurantTypeMapping rtm 
           inner join  restaurantType rt
           on rtm.restaurentTypeId=rt.id;`);
            const menuData = await getLastSeenActivityQuery(`select rm.id, rm.categoryId,mc.Name as category, rm.restaurantId, rm.Name, rm.description, rm.amount, rm.imageUrl, rm.status from munchngive_dev.restaurantMenu rm
           inner join  menuCategory mc on rm.categoryId=mc.id;`);
            const menufoodTypeData = await getLastSeenActivityQuery(` SELECT  mftm.menuId, mftm.foodTypeId ,ft.Name as foodType 
           FROM restaurantMenu rm inner join
           menuFoodTypeMapping mftm on rm.id=mftm.menuId
           inner join foodType ft on mftm.foodTypeId=ft.id
           ;`);
            const restaurentsTimingData = await getLastSeenActivityQuery(` SELECT id, day, openHours, closedHours, restaurantId FROM scheduleTime;`);

            const menuToppings = await getLastSeenActivityQuery(`SELECT mtm.id,t.id as toppingId,mtm.restaurantId,mtm.menuId, t.addOn, t.subAddOn, t.AddOnAmount FROM toppings t inner join menuToppingMapping mtm
           on t.id=mtm.toppingId`);

            const menuToppingsSize = await getLastSeenActivityQuery(`SELECT tsm.id,ts.id as sizeId,ts.size, restaurantId, menuId, toppingSizeId, price FROM toppingSize ts inner join menuToppingSizeMapping tsm
           on ts.id=tsm.toppingSizeId`);

            var data = [];
            await restaurants.map(async (restaurant) => {
                let obj = {
                    id: restaurant.id,
                    Name: restaurant.Name,
                    latitude: restaurant.latitude,
                    longitude: restaurant.longitude,
                    imageUrl: restaurant.imageUrl,
                    preparationTime: restaurant.preparationTime,
                    avgrating: restaurant.avgrating,
                    reviewCount: restaurant.reviewCount,
                    distance: utils.distance(restaurant.latitude, payload.latitude, restaurant.longitude, payload.longitude),
                    description: restaurant.description,
                    address: restaurant.address,
                    favourite: [],
                    restaurantOffers: [],
                    munchMagicAdminOffer: [],
                    restaurantType: [],
                    menu: [],
                    restaurantTiming: []
                }

                var offer = munchMagicData.filter(({ restaurantId }) => restaurantId === restaurant.id)
                obj.munchMagicAdminOffer.push(...offer);

                var restOffer = restaurantOfferData.filter(({ restaurantId }) => restaurantId === restaurant.id)
                obj.restaurantOffers.push(...restOffer);

                var Favour = restaurentsFavour.filter(({ restaurentId, customerId }) => restaurentId === restaurant.id && customerId === payload.customerId)
                obj.favourite.push(...Favour);

                var restaurantTypeMapping = restaurantTypeData.filter(({ restaurentId }) => restaurentId === restaurant.id)
                obj.restaurantType.push(...restaurantTypeMapping);

                var menuDataMapping = menuData.filter(({ restaurantId }) => restaurantId === restaurant.id)

                var restaurentsTimingDataMapping = restaurentsTimingData.filter(({ restaurantId }) => restaurantId === restaurant.id)
                obj.restaurantTiming.push(...restaurentsTimingDataMapping);

                // obj.menu.push(...menuDataMapping); 
                await menuDataMapping.map(async (menu) => {
                    var percentage = restaurantOfferData.filter(({ restaurantId }) => restaurantId === menu.restaurantId)
                    var offerAmount = percentage.length >= 1 ? (menu.amount * percentage[0].discount) / 100 : 0;
                    let obj1 = {
                        id: menu.id,
                        categoryId: menu.categoryId,
                        category: menu.category,
                        restaurantId: menu.restaurantId,
                        Name: menu.Name,
                        description: menu.description,
                        amount: menu.amount,
                        priceToPay:parseFloat( menu.amount - offerAmount).toFixed(2),
                        imageUrl: menu.imageUrl,
                        foodType: [],
                        toppings: [],
                        toppingSize: []
                    }
                    var foodTypeData = menufoodTypeData.filter(({ menuId }) => menuId === menu.id)
                    obj1.foodType.push(...foodTypeData);

                    var menuTopping = menuToppings.filter(({ menuId }) => menuId === menu.id)
                    obj1.toppings.push(...menuTopping);

                    var menuToppingSize = menuToppingsSize.filter(({ menuId }) => menuId === menu.id)
                  await  menuToppingSize.map(async (menutop) => {
                    var sizeAmount = percentage.length >= 1 ? (menutop.price * percentage[0].discount) / 100 : 0;
                    var sizecalculation={
                        id: menutop.id,
                        sizeId: menutop.sizeId,
                        size: menutop.size,
                        restaurantId: menutop.restaurantId,
                        menuId: menutop.restaurantId,
                        toppingSizeId: menutop.toppingSizeId,
                        priceToPay: menutop.price,
                        price: parseFloat(menutop.price - sizeAmount).toFixed(2)
                    }
                    obj1.toppingSize.push(sizecalculation);
                })
                    obj.menu.push(obj1);

                })

                data.push(obj);
            })

        }
        catch (e) {
            // Log Errors
            throw Error('Error while getting restaurent', e);
        }
        return data;
    }

    static async favouriteRestaurant(payload) {
        try {
            const restaurentFavours = await getLastSeenActivityQuery(`SELECT * FROM restaurentFavour where (restaurentId = ${payload.restaurentId} and customerId=${payload.customerId} );`);
            let favouriteRestaurant;
            if (restaurentFavours && restaurentFavours.length > 0) {
                //User exists
                favouriteRestaurant = await restaurentFavour.update({ favCheck: payload.favCheck }, { where: { restaurentId: payload.restaurentId, customerId: payload.customerId } })
            }
            else {
                //Create a User 
                favouriteRestaurant = await restaurentFavour.create(payload);
            }
            //return the created/exists user
            return favouriteRestaurant;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while favourite Restaurant', e);
        }
    }

    static async restaurentReviewRating(payload) {
        try {
            const restaurentReviewRatings = await getLastSeenActivityQuery(`SELECT rr.id, rr.restaurentId, rr.customerId, c.Name as customer,rr.rating, rr.review FROM restaurentRating rr
            inner join customer c on rr.customerId=c.id where rr.restaurentId= ${payload.restaurantId}`);
            let restaurentReviewRating;
            if (restaurentReviewRatings && restaurentReviewRatings.length > 0) {
                //User exists
                restaurentReviewRating = restaurentReviewRatings;
            }
            else {
                //Create a User 
                restaurentReviewRating = [];
            }
            //return the created/exists user
            return restaurentReviewRating;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while getting rastaurant review and ratings', e);
        }
    }

    static async addRestaurentReviewRating(payload) {
        try {
            const restaurentReviewRatings = await getLastSeenActivityQuery(`SELECT * FROM restaurentRating where (restaurentId = ${payload.restaurentId} and customerId=${payload.customerId} );`);
            let restaurentReviewRating;
            if (restaurentReviewRatings && restaurentReviewRatings.length > 0) {
                //User exists
                restaurentReviewRating = await restaurentRating.update({ rating: payload.rating, review: payload.review }, { where: { restaurentId: payload.restaurentId, customerId: payload.customerId } })
            }
            else {
                //Create a User 
                restaurentReviewRating = await restaurentRating.create(payload);
            }
            //return the created/exists user
            return restaurentReviewRating;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while adding Restaurant Review and Rating', e);
        }
    }

    static async orders(payload) {
        try {

            let order = {
                invoiceId: utils.randomAlphaNumaric(20, '12345abcde'),
                customerId: payload.customerId,
                customerAddressId: payload.customerAddressId,
                restaurantId: payload.restaurantId,
                orderScheduleTime: payload.orderScheduleTime,
                orderPickupTime: payload.orderPickupTime,
                orderReadyStatus: payload.orderReadyStatus,
                orderStatus: payload.orderStatus ? payload.orderStatus : 1,
                generateOrderId: utils.randomAlphaNumaric(10, '12345abcde'),
                latitude: payload.latitude,
                longitude: payload.longitude,
            }

            var maxId = await orders.create(order).then((data) => {
                return data.id;
            }).catch(err => console.log("error :", err))
            console.log("maxid :", maxId);

            await payload.orderMenu.map(async (menu) => {
                let orderDetail = {
                    orderId: maxId,
                    menuId: menu.menuId,
                    quantity: menu.quantity,
                    addOnId: menu.addOnId,
                    itemCost: menu.itemCost,
                }
                return await orderDetails.create(orderDetail);
            })

            let orderStatusDetails = {
                orderId: maxId,
                orderStatusId: 1
            }

            await orderProcessDetails.create(orderStatusDetails);

            let orderPaymentDetail = {
                orderId: maxId,
                gross: payload.gross,
                discount: payload.discount,
                promoCodeId: payload.promoCodeId,
                promoCodeAmount: payload.promoCodeAmount,
                tip: payload.tip,
                tax: payload.tax,
                net: payload.net,
                totalPay: payload.totalPay,
                paymentMode: payload.paymentMode,
            }

            return await orderPaymentDetails.create(orderPaymentDetail);

        }
        catch (e) {
            // Log Errors
            throw Error('Error while adding order', e);
        }
    }

    static async createOrderProcessDetails(payload) {
        try {
            let orderStatusDetails = {
                orderId: payload.orderId,
                orderStatusId: payload.orderStatusId
            }
            var orderProcessDetail = await getLastSeenActivityQuery(`SELECT * FROM orderProcessDetails where orderId=${payload.orderId} and orderStatusId=${payload.orderStatusId}`);
            if (!(orderProcessDetail.length >= 1)) {
                await orders.update({ orderStatus: payload.orderStatusId }, { where: { id: payload.orderId } });

                return await orderProcessDetails.create(orderStatusDetails);
            } else {
                return payload;
            }

        }
        catch (e) {
            // Log Errors
            throw Error('Error while order Process Details creation', e);
        }
    }

    static async OrderProcessDetails(payload) {
        try {

            var orderProcessDetails = await getLastSeenActivityQuery(`select orderId,orderStatusId,OrderStatus,details,opd.CreatedDate as orderedDate from orderProcessDetails opd inner join orderStatus os
            on opd.orderStatusId=os.id where orderId=${payload.orderId}`);

        }
        catch (e) {
            // Log Errors
            throw Error('Error while getting order Process Details', e);
        }
        return orderProcessDetails;
    }

    static async createCard(payload) {
        try {
            const getCardDetails = await getLastSeenActivityQuery(`SELECT id, customerId, name, number, toDate FROM cardDetails where (number = '${payload.number}' );`);
            let CardDetails;
            if (getCardDetails && getCardDetails.length > 0) {
                if (payload.id) {
                    CardDetails = await cardDetails.update({ name: payload.name, toDate: payload.toDate, number: payload.newNumber }, { where: { id: payload.id } });
                }
                else {
                    CardDetails = null;
                }
            }
            else {
                //Create a User 
                CardDetails = await cardDetails.create(payload);
            }
            //return the created/exists user
            return CardDetails;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while creating customer', e);
        }
    }

    static async cardList(payload) {
        try {
            const getCardDetails = await getLastSeenActivityQuery(`SELECT id, customerId, name, number, toDate FROM cardDetails where (customerId = '${payload.customerId}' );`);
            let CardDetails;
            if (getCardDetails && getCardDetails.length > 0) {
                CardDetails = getCardDetails;
            }
            else {
                //Create a User 
                CardDetails = getCardDetails;
            }
            //return the created/exists user
            return CardDetails;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while getting card details', e);
        }
    }

    static async favouriteMenuRestaurant(payload) {
        try {
            const restaurentMenuFavours = await getLastSeenActivityQuery(`SELECT * FROM restaurantMenuFavour where (restaurantId = ${payload.restaurantId} and customerId=${payload.customerId}  and menuId=${payload.menuId} );`);
            let favouriteMenuRestaurant;
            if (restaurentMenuFavours && restaurentMenuFavours.length > 0) {
                //User exists
                favouriteMenuRestaurant = await restaurantMenuFavour.update({ favCheck: payload.favCheck }, { where: { restaurantId: payload.restaurantId, customerId: payload.customerId, menuId: payload.menuId } })
            }
            else {
                //Create a User 
                favouriteMenuRestaurant = await restaurantMenuFavour.create(payload);
            } 0
            //return the created/exists user
            return favouriteMenuRestaurant;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while favourite Restaurant menu', e);
        }
    }

    static async orderStatus(payload) {
        try {
            const orderStatusObj = await getLastSeenActivityQuery(`SELECT id, orderStatus, status, details FROM orderStatus where status=1;`);
            let orderStatus;
            if (orderStatusObj && orderStatusObj.length > 0) {
                //User exists
                orderStatus = orderStatusObj;
            }
            else {
                //Create a User 
                orderStatus = [];
            } 0
            //return the created/exists user
            return orderStatus;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while fetching order status', e);
        }
    }

    static async pastOrders(payload) {
        try {
            const pastOrder = await getLastSeenActivityQuery(`select o.id, o.invoiceId, o.customerId, o.customerAddressId, o.restaurantId, o.orderScheduleTime, o.orderPickupTime, o.orderStatus,
            o.latitude, o.longitude,gross, discount, promoCodeId, promoCodeAmount, tip, tax, net, totalPay, paymentMode from 
           munchngive_dev.orders o inner join munchngive_dev.orderPaymentDetails op on o.id=op.orderId where o.customerId=${payload.customerId} and (orderStatus=5 or orderStatus=6 or orderStatus=7) `);

            const menuDetails = await getLastSeenActivityQuery(`select o.id, o.customerId, od.menuId,rm.Name as menu, od.quantity, od.addOnId, od.itemCost from 
           munchngive_dev.orders o inner join munchngive_dev.orderDetails od on o.id=od.orderId
           inner join munchngive_dev.restaurantMenu rm on od.menuId=rm.id where o.customerId=${payload.customerId}`);
            let obj;
            let pastOrders;
            if (pastOrder && pastOrder.length > 0) {

                await pastOrder.map(async (order) => {
                    obj = {
                        ...order,
                        orderMenu: [],

                    }
                    var orderMenus = menuDetails.filter(({ id }) => id === order.id)
                    obj.orderMenu.push(...orderMenus);

                })
                pastOrders = obj;
            }
            else {
                //Create a User 
                pastOrders = [];
            }
            //return the created/exists user
            return pastOrders;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while fetching past orders', e);
        }
    }

    static async pendingOrders(payload) {
        try {
            const pendingOrder = await getLastSeenActivityQuery(`select o.id, o.invoiceId, o.customerId, o.customerAddressId, o.restaurantId, o.orderScheduleTime, o.orderPickupTime, o.orderStatus,
            o.latitude, o.longitude,gross, discount, promoCodeId, promoCodeAmount, tip, tax, net, totalPay, paymentMode from 
           orders o inner join orderPaymentDetails op on o.id=op.orderId where o.customerId=${payload.customerId} and (orderStatus=1 or orderStatus=2 or orderStatus=3 or orderStatus=4) `);

            const menuDetails = await getLastSeenActivityQuery(`select o.id, o.customerId, od.menuId,rm.Name as menu, od.quantity, od.addOnId, od.itemCost from 
           orders o inner join orderDetails od on o.id=od.orderId
           inner join restaurantMenu rm on od.menuId=rm.id where o.customerId=${payload.customerId}`);
            let obj;
            let pendingOrders;
            if (pendingOrder && pendingOrder.length > 0) {

                await pendingOrder.map(async (order) => {
                    obj = {
                        ...order,
                        orderMenu: [],

                    }
                    var orderMenus = menuDetails.filter(({ id }) => id === order.id)
                    obj.orderMenu.push(...orderMenus);

                })
                pendingOrders = obj;
            }
            else {
                //Create a User 
                pendingOrders = [];
            }
            //return the created/exists user
            return pendingOrders;
        }
        catch (e) {
            // Log Errors
            throw Error('Error while fetching pending orders', e);
        }
    }

    static async cart_backup(payload) {
        try {
            const restaurantMenuDetails = await getLastSeenActivityQuery(`select rm.restaurantId,rm.id as menuId,rm.Name as menuItem,Amount from restaurantMenu rm inner join restaurant r on
            rm.restaurantId=r.id where rm.restaurantId=${payload.restaurantId}`);

            const toppingDetails = await getLastSeenActivityQuery(`  select mtm.id, restaurantId, menuId, toppingId,t.subAddOn as topping,t.AddOnAmount from menuToppingMapping mtm
            inner join toppings t on mtm.toppingId=t.id where restaurantId =${payload.restaurantId}`);

            const varientDetails = await getLastSeenActivityQuery(`select mtsm.id, restaurantId, menuId, toppingSizeId,ts.size as size,mtsm.price from menuToppingSizeMapping mtsm
            inner join toppingSize ts on mtsm.toppingSizeId=ts.id where restaurantId =${payload.restaurantId}`);




            var data = [];
            var totalPrice = 0.0;
            var status = 0;
            await payload.cartItem.map(async (menu, index) => {
                var menuobj = restaurantMenuDetails.filter(({ menuId }) => menuId === menu.menuId)[0];
                var toppingobj = toppingDetails.filter(({ menuId }) => menuId === menu.menuId);
                var varientobj = varientDetails.filter(({ menuId }) => menuId === menu.menuId);
                var priceToPay = 0.0;

                var obj = {
                    restaurantId: payload.restaurantId,
                    menuId: menu.menuId,
                    menuItem: menuobj.menuItem,
                    quantity: menu.quantity,
                    unitPrice: menuobj.Amount,
                    Amount: (menu.quantity * menuobj.Amount),
                    addonItem: [],
                    varient: [],
                }
                await payload.cartItem[index].addOn.map(async (addon) => {
                    var topping = toppingobj.filter(({ toppingId }) => toppingId === addon.addOnId);
                    priceToPay = priceToPay + parseFloat(topping[0].AddOnAmount);
                    status = 1;
                    obj.addonItem.push(...topping);
                })

                await payload.cartItem[index].varient.map(async (vari) => {
                    var varient = varientobj.filter(({ toppingSizeId }) => toppingSizeId === vari.toppingSizeId);
                    priceToPay = priceToPay + parseFloat(varient[0].price);
                    obj.varient.push(...varient);
                })
                if (status == 0) {
                    priceToPay = priceToPay + parseFloat(obj.Amount);
                }
                totalPrice = totalPrice + priceToPay;
                var newObj = {
                    totalPrice,
                    ...obj,

                }
                status = 0;
                data.push(newObj);
            })


        }
        catch (e) {
            // Log Errors
            throw Error('Error while adding order', e);
        }
        return data;
    }

    static async cart(payload) {
        try {
            const restaurantMenuDetails = await getLastSeenActivityQuery(`select rm.restaurantId,rm.id as menuId,rm.Name as menuItem,Amount from restaurantMenu rm inner join restaurant r on
            rm.restaurantId=r.id where rm.restaurantId=${payload.restaurantId}`);

            const toppingDetails = await getLastSeenActivityQuery(`  select mtm.id, restaurantId, menuId, toppingId,t.subAddOn as topping,t.AddOnAmount from menuToppingMapping mtm
            inner join toppings t on mtm.toppingId=t.id where restaurantId =${payload.restaurantId}`);

            const varientDetails = await getLastSeenActivityQuery(`select mtsm.id, restaurantId, menuId, toppingSizeId,ts.size as size,mtsm.price from menuToppingSizeMapping mtsm
            inner join toppingSize ts on mtsm.toppingSizeId=ts.id where restaurantId =${payload.restaurantId}`);




            var data = [];
            var totalPrice = 0.0;
            var status = 0;
            await payload.cartItem.map(async (menu, index) => {
                var menuobj = restaurantMenuDetails.filter(({ menuId }) => menuId === menu.menuId)[0];
                var toppingobj = toppingDetails.filter(({ menuId }) => menuId === menu.menuId);
                var varientobj = varientDetails.filter(({ menuId }) => menuId === menu.menuId);
                var priceToPay = 0.0;

                var obj = {
                    restaurantId: payload.restaurantId,
                    menuId: menu.menuId,
                    menuItem: menuobj.menuItem,
                    quantity: menu.quantity,
                    unitPrice: menuobj.Amount,
                    Amount: (menu.quantity * menuobj.Amount),
                    addonItem: [],
                    varient: [],
                }
                await payload.cartItem[index].addOn.map(async (addon) => {
                    var topping = toppingobj.filter(({ toppingId }) => toppingId === addon.addOnId);
                    priceToPay = priceToPay + parseFloat(topping[0].AddOnAmount);
                    status = 1;
                    obj.addonItem.push(...topping);
                })

                await payload.cartItem[index].varient.map(async (vari) => {
                    var varient = varientobj.filter(({ toppingSizeId }) => toppingSizeId === vari.toppingSizeId);
                    priceToPay = priceToPay + parseFloat(varient[0].price);
                    obj.varient.push(...varient);
                })
                if (status == 0) {
                    priceToPay = priceToPay + parseFloat(obj.Amount);
                }
                totalPrice = totalPrice + priceToPay;
                var newObj = {
                    totalPrice,
                    ...obj,

                }
                status = 0;
                data.push(newObj);
            })


        }
        catch (e) {
            // Log Errors
            throw Error('Error while adding order', e);
        }
        return data;
    }

    static async calculateTax(payload) {
        try {
            // const restaurantMenuDetails = await getLastSeenActivityQuery(`select rm.restaurantId,rm.id as menuId,rm.Name as menuItem,Amount from restaurantMenu rm inner join restaurant r on
            // rm.restaurantId=r.id where rm.restaurantId=${payload.restaurantId}`);

            // const toppingDetails = await getLastSeenActivityQuery(`  select mtm.id, restaurantId, menuId, toppingId,t.subAddOn as topping,t.AddOnAmount from menuToppingMapping mtm
            // inner join toppings t on mtm.toppingId=t.id where restaurantId =${payload.restaurantId}`);

            // const varientDetails = await getLastSeenActivityQuery(`select mtsm.id, restaurantId, menuId, toppingSizeId,ts.size as size,mtsm.price from menuToppingSizeMapping mtsm
            // inner join toppingSize ts on mtsm.toppingSizeId=ts.id where restaurantId =${payload.restaurantId}`);
            var data = [];
            var totalPrice = 0.0;
            var status = 0;
            await payload.orderMenu.map(async (menu, index) => {
                // var menuobj = restaurantMenuDetails.filter(({ menuId }) => menuId === menu.menuId)[0];
                // var toppingobj = toppingDetails.filter(({ menuId }) => menuId === menu.menuId);
                // var varientobj = varientDetails.filter(({ menuId }) => menuId === menu.menuId);
                var priceToPay = 0.0;
                var addonTax = 0.0;
                var varientTax=0.0;

                var obj = {
                    restaurantId: payload.restaurantId,
                    menuId: menu.menuId,
                    quantity: menu.quantity,
                    itemCost: menu.itemCost,
                    tax:parseFloat((6.625*(menu.itemCost))/100).toFixed(2),                  
                    addonItem: [],
                    varient: [],
                }
                await payload.orderMenu[index].addOn.map(async (addon) => {
                    addOnId= addon.addOnId,
                    quantity= addon.quantity,
                    itemCost= addon.itemCost,
                    addonTax=addonTax+parseFloat((6.625*(addon.itemCost))/100).toFixed(2), 
                    status = 1;
                    obj.addonItem.push(...addon,addonTax);
                })

                await payload.orderMenu[index].varient.map(async (vari) => {                  
                    toppingSizeId= vari.toppingSizeId,
                    quantity= vari.quantity,
                    itemCost= vari.itemCost,
                    varientTax=varientTax+parseFloat((6.625*(vari.itemCost))/100).toFixed(2), 
                    obj.varient.push(...vari,varientTax);
                })
                if (status == 0) {
                    priceToPay = priceToPay + parseFloat(obj.Amount);
                }
                totalPrice = totalPrice + priceToPay;
                var newObj = {
                    totalPrice,
                    ...obj,

                }
                status = 0;
                data.push(newObj);
            })


        }
        catch (e) {
            // Log Errors
            throw Error('Error while adding order', e);
        }
        return data;
    }
}



function getLastSeenActivityQuery(databaseQuery) {
    return new Promise(data => {
        con.getConnection(function async(err, connection, pool) {
            if (err) throw err;
            connection.query(databaseQuery, function (error, result) {
                if (error) {
                    connection.release();
                    throw error;
                }
                try {
                    data(result);
                    connection.release();
                } catch (error) {
                    data({});
                    connection.release();
                    throw error;
                }
            });
        })
    });
}

module.exports = restaurantService;
