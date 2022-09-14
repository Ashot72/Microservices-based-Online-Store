import { useEffect, useState } from "react";
import Router from "next/router";

import useRequest from "../hooks/use-request";
import { ICategory, IProduct, ICurrentUser } from "./shared/interface";
import ServerError from "./shared/serverError";

export interface IMainPage {
  currentUser: ICurrentUser;
  categories: ICategory[]
  products: IProduct[];
  catId: string
  error: null | { message: string }
}

const MainPage = ({ error, categories, products }: IMainPage) => {
  const [categoryId, setCategoryId] = useState("")
  const [catProducts, setCatProducts] = useState<IProduct[]>([])

  const { doRequest: getProducts, errors: productErrors } = useRequest({
    url: `/api/products/${categoryId}`,
    method: "get",
    body: {},
    onSuccess: (products: IProduct[]) => setCatProducts(products)
  });

  const { doRequest: addProductToCart, errors: addToCartErrors } = useRequest({
    url: `/api/products/addToCart`,
    method: "post",
    body: {},
    onSuccess: () => Router.push(`/cart`)
  });

  useEffect(() => {
    if (categories && categories.length > 0 && products) {
      setCategoryId(categories[0].id)
      setCatProducts(products || [])
    }
  }, [])

  useEffect(() => {
    if (categoryId) {
      getProducts()
    }
  }, [categoryId]);

  const selectCat = (catId: string) => setCategoryId(catId)

  const addToCart = (p: IProduct) =>
    addProductToCart({
      id: p.id,
      name: p.name,
      description: p.description,
      version: p.version,
      price: p.price,
      picture: p.picture,
      categoryId: p.category.id
    })

  if (error) {
    return (
      <ServerError error={error} />
    )
  }

  return (
    <>
      {productErrors || addToCartErrors}
      <div style={{ display: "flex" }}>
        <div className="py-2" style={{ width: "385px" }}>
          <ul className="list-group">
            {
              categories.map((cat: ICategory) =>
                <li
                  key={cat.id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                  onClick={() => selectCat(cat.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{cat.name}</div>
                    {cat.description}
                  </div>
                  {categoryId === cat.id &&
                    <span className="badge bg-primary rounded-pill">{catProducts.length}</span>
                  }
                </li>
              )}
          </ul>
        </div>
        <div style={{ width: "100%" }}>
          {catProducts.length > 0 &&
            <div className="px-2 py-2">
              {
                catProducts.map((product: IProduct) =>
                  <div className="card mb-3" key={product.id}>
                    <div className="card-body">
                      <div className="me-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <img src={product.picture}
                            className="img-fluid" style={{ width: "150px" }} />
                          <div className="mx-5">
                            <h5 className="text-primary">{product.name}</h5>
                            <div className="text-secondary">{product.description}</div>
                            <div className="fw-bold mb-0 pe-3">Price: ${product.price}</div>
                            <div className="mb-0 pe-3">Qty: {product.count}</div>
                            {product.views > 0 &&
                              <p className="mb-0 pe-3" style={{ color: "red" }}>
                                {product.views === 1 ? `1 view of the product` : `${product.views} views of the product`}
                              </p>}
                          </div>
                          <div className="text-end">
                            <button
                              type="button"
                              className="btn btn-primary text-nowrap"
                              onClick={e => addToCart(product)}
                            >Add to Cart</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          }
        </div>
      </div>
    </>
  );
};

MainPage.getInitialProps = async (
  context: any,
  client: any,
  currentUser: ICurrentUser,
) => {
  try {
    const { data: categories } = await client.get("/api/categories");

    let products = null
    if (categories.length > 0) {
      const { data } = await client.get(`/api/products/${categories[0].id}`);
      products = data
    }

    return { error: null, categories, products };

  } catch (error) {
    return { error };
  }

};

export default MainPage;
