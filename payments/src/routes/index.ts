import express, { Request, Response } from 'express'
import { Payment } from '../models/payment'

const router = express.Router()

router.get("/api/payments", async (req: Request, res: Response) => {
    const payments = await Payment.find({ userId: req.currentUser!.id })

    res.send(payments)
})

export { router as indexPaymentsRouter }