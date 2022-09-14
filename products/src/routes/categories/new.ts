import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { validateRequest, requireAuth, BadRequestError } from "@lightningtools/common"
import { Category } from '../../models/category'

const router = express.Router()

router.post("/api/categories", requireAuth, [
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
    const { name, description } = req.body

    const category = Category.build({
      name,
      description,
      userId: req.currentUser!.id
    })

    try {
      await category.save()
    } catch (e: any) {
      throw new BadRequestError(`Category '${name}' already exists.`)
    }

    res.status(201).send(category)
  })

export { router as createCategoryRouter }