import express, { Request, Response } from 'express'
import {
    requireAuth,
} from "@lightningtools/common"
import { Cart } from '../models/cart'

const router = express.Router()

router.get("/api/cart",
    requireAuth,
    async (req: Request, res: Response) => {
        const cart = await Cart.findById(req.currentUser!.id).populate("info.product")

        res.send(cart)
    })

export { router as indexCartRouter }