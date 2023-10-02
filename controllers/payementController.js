// import ORM to handle Database and asyncHandler to handle errors
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");


//Stripe payment gateway
const stripe = require("stripe")("sk_test_51NqBgDCN3qmJpj2XQ8NZfx2nipYPHsU1KpwkusW6nLLXHqADuLHLkLXByh2sRqDiAWmRdVVuxWnxOiSaF8rCkoQj00mHGK2MKt");
const endpointSecret = "whsec_551e514784fa91287fa85be2b49f260d22a52d0daf0432f3d18f7f72c78d4da1";



const calculateOrderAmount = async (items) => {
    console.log("calculateOrderAmount");
    console.log(items);

    let total = 0;

    for (const element of items) {
        try {
            const pack = await prisma.study_pack.findUnique({
                where: {
                    id: element.id
                },
                select: {
                    price: true,
                    course: {
                        select: {
                            monthly_fee: true
                        }
                    },
                    student_purchase_studypack: {
                        where: {
                            status: "PAID"
                        },
                        select: {
                            status: true
                        },
                        orderBy: {
                            purchased_at: "desc"
                        },
                    }
                }
            });

            console.log(pack);

            if (pack.price !== null && pack.price !== undefined) {
                if (pack.student_purchase_studypack.length > 0) {
                    if (pack.student_purchase_studypack[0].status === "EXTENDED" || pack.student_purchase_studypack[0].status === "PAID") {
                        total += 400;
                    }
                } else {
                    total += pack.price;
                }
            } else if (pack.courses !== null && pack.courses !== undefined) {
                if (pack.student_purchase_studypack.length > 0) {
                    if (pack.student_purchase_studypack[0].status === "EXTENDED" || pack.student_purchase_studypack[0].status === "PAID") {
                        total += 400;
                    }
                } else {
                    total += pack.courses.monthly_fee;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log(total);

    return total * 100;
};

const createPaymentIntent = asyncHandler(async (req, res) => {
    console.log("createPaymentIntent");
    const user = req.user;

    const { items } = req.body;

    const ammount = await calculateOrderAmount(items);

    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: ammount,
            currency: "lkr",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            payment_method_types: ["card"],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error);
    }

});



const fulfillOrder = (session) => {
    // TODO: fill me in
    console.log("Fulfilling order", session);
}

const createOrder = (session) => {
    // TODO: fill me in
    console.log("Creating order", session);
}

const emailCustomerAboutFailedPayment = (session) => {
    // TODO: fill me in
    console.log("Emailing customer", session);
}

const webHook = asyncHandler(async (request, response) => {
    console.log("webHook");
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log(event);

    } catch (err) {
        console.log(err);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    response.status(200).end();
    // // Handle the event
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         const paymentIntentSucceeded = event.data.object;
    //         fulfillOrder()
    //         // Then define and call a function to handle the event payment_intent.succeeded
    //         break;
    //     // ... handle other event types
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }

    //     // Return a 200 response to acknowledge receipt of the event
    //     response.send();

    //     const payload = request.body;



    //     // Handle the checkout.session.completed event
    //     if (event.type === 'checkout.session.completed') {
    //         const session = event.data.object;
    //         console.log("completed 1")
    //         console.log("session", session)
    //         // Fulfill the purchase...
    //         fulfillOrder(session);
    //     }
    //     switch (event.type) {
    //         case 'checkout.session.completed': {
    //             console.log("completed 2")
    //             const session = event.data.object;
    //             // Save an order in your database, marked as 'awaiting payment'
    //             // createOrder(session);

    //             // Check if the order is paid (for example, from a card payment)
    //             //
    //             // A delayed notification payment will have an `unpaid` status, as
    //             // you're still waiting for funds to be transferred from the customer's
    //             // account.
    //             if (session.payment_status === 'paid') {
    //                 fulfillOrder(session);
    //                 console.log("paid")
    //             }

    //             break;
    //         }

    //         case 'checkout.session.async_payment_succeeded': {
    //             const session = event.data.object;

    //             // Fulfill the purchase...
    //             fulfillOrder(session);
    //             console.log("async_payment_succeeded")

    //             break;
    //         }

    //         case 'checkout.session.async_payment_failed': {
    //             const session = event.data.object;

    //             // Send an email to the customer asking them to retry their order
    //             emailCustomerAboutFailedPayment(session);
    //             console.log("async_payment_failed")

    //             break;
    //         }
    //     }

    //     response.status(200).end();
});


// const webHook = asyncHandler(async (request, response) => {
//     const payload = request.body;

//     console.log("Got payload: " + payload);

//     response.status(200).end();
// });

const addPayment = asyncHandler(async (req, res) => {
    const user = req.user;

    const { paymentIntentId, items } = req.body;

    try {
        const foundUser = await prisma.users.findUnique({
            where: {
                username: user
            },
            select: {
                id: true
            }
        });

        if (!foundUser) {
            res.status(404);
            throw new Error("User not found");
        }


        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        let payment;
        // if (paymentIntent.status === "succeeded") {
        const pack = await prisma.study_pack.findUnique({
            where: {
                id: items[0].id
            },
            include: {
                student_purchase_studypack: {
                    orderBy: {
                        purchased_at: "desc"
                    }
                }
            }
        });

        if (pack) {
            if (pack.student_purchase_studypack.length > 0) {
                if (pack.student_purchase_studypack[0].status === "EXTENDED" || pack.student_purchase_studypack[0].status === "PAID" && pack.student_purchase_studypack[0].expire_date > new Date()) {
                    res.status(400).json({
                        message: "You have already purchased this pack"
                    });
                } else if (pack.student_purchase_studypack[0].status === "EXTENDED" || pack.student_purchase_studypack[0].status === "PAID" && pack.student_purchase_studypack[0].expire_date < new Date()) {
                    payment = await prisma.student_purchase_studypack.update({
                        where: {
                            id: pack.student_purchase_studypack[0].id
                        },
                        data: {
                            status: "EXTENDED",
                            expire_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                            purchased_at: new Date(),
                            reciept_location: "hello"
                        }
                    });
                }
            } else {
                payment = await prisma.student_purchase_studypack.create({
                    data: {
                        ammount: 2500,
                        pack: {
                            connect: {
                                id: items[0].id
                            }
                        },
                        student: {
                            connect: {
                                id: foundUser.id
                            }
                        },
                        reciept_location: "hello",
                        expire_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                        type: "ONLINE",
                        status: "PAID",
                    }
                });
            }

            res.status(200).json({
                message: "Payment added successfully",
                data: payment
            });
        } else {
            res.status(404);
            throw new Error("Study pack not found");
        }
        // } else {
        //     res.status(400);
        //     throw new Error("Payment not succeeded");
        // }
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error);
    }
});




module.exports = {
    createPaymentIntent,
    webHook,
    addPayment
};
