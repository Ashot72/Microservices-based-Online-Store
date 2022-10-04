import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { validateRequest, requireAuth, NotFoundError } from "@lightningtools/common"
import { Cart } from '../models/cart'
import { Payment } from '../models/payment'
import { stripe } from '../stripe'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post("/api/payments", requireAuth, [
    body("token")
        .not()
        .isEmpty(),
    body("total")
        .isFloat({ gt: 0 })
        .withMessage("Total must be greater than 0"),
],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, total } = req.body

        const cart = await Cart.findById(req.currentUser!.id)

        if (!cart) {
            throw new NotFoundError()
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: total * 100,
            source: token
        })

        const payment = Payment.build({
            userId: cart._id,
            stripeId: charge.id,
            info: cart.info
        })

        await payment.save()

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            userId: req.currentUser!.id,
            stripeId: charge.id
        })

        res.status(201).send({ id: payment.id })
    }
)

export { router as createPaymentRouter }
