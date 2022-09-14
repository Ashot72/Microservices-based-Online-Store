import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
    validateRequest,
    requireAuth,
    NotFoundError,
    NotAuthorizedError
} from "@lightningtools/common"
import { Category } from '../../models/category'

const router = express.Router()

router.put("/api/categories/:id",
    requireAuth,
    [
        body('name')
            .not()
            .isEmpty()
            .withMessage("Name is required"),
        body("description")
            .not()
            .isEmpty()
            .withMessage("Description is required")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        let category = await Category.findById(req.params.id)

        if (!category) {
            throw new NotFoundError()
        }

        if (category.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }

        category.set({
            name: req.body.name,
            description: req.body.description
        })

        await category.save()

        res.send(category)
    })

export { router as updateCategoryRouter } 