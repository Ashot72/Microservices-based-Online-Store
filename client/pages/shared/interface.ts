
export interface ICategory {
  id: string;
  name: string;
  description: string;
  userId: string;
}

export interface Info {
  product: IProduct
  qty: number
  limit: boolean
}

export interface IProduct {
  id: string
  name: string
  description: string
  price: number
  picture: string
  categoryId: string,
  version?: number,
  count: number,
  category: ICategory,
  views: number
}

export interface ICurrentUser {
  id: string
  email: string
}

export interface ICart {
  id: string,
  name: string,
  description: string,
  price: number,
  userId: string,
  picture: string
  categoryId: string,
  count: number
  version: number
  info: Info[]
}

export interface IPayments {
  id: string,
  stripeId: string,
  name: string,
  description: string,
  price: number,
  userId: string,
  picture: string
  categoryId: string,
  count: number
  version: number
  info: Info[]
}