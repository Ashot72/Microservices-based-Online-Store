import { useRef } from "react";
import { ICurrentUser } from "../shared/interface";
import { useEffect, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { ICategory } from "../shared/interface";
import ServerError from "../shared/serverError";
import { IProduct } from "../shared/interface";

export interface IProductsPage {
  currentUser: ICurrentUser;
  categories: ICategory[]
  products: IProduct[];
  catId: string
  error: null | { message: string }
}

const ProductsPage = ({ error, categories, products, catId }: IProductsPage) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [picture, setPicture] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [count, setCount] = useState("");
  const [shouldDelete, setShouldDelete] = useState(false);
  const [addUpdate, setAddUpdate] = useState("");
  const [modalErrors, setModalErrors] = useState(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { doRequest, errors } = useRequest({
    url: (shouldDelete || id) ? `/api/products/${id}` : `/api/products`,
    method: shouldDelete ? "delete" : id ? "put" : "post",
    body: {
      categoryId,
      name,
      description,
      price,
      count,
      picture,
    },
    onSuccess: () => {
      closeBtnRef.current!.click();
      setDefault();
      Router.push("/products/[catId]", `/products/${catId}`)
    },
  });

  useEffect(() => {
    setModalErrors(errors);
  }, [errors]);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    doRequest();
  };

  const setDefault = () => {
    setShouldDelete(false);
    setId("");
    setName("");
    setCategoryId("")
    setDescription("");
    setPrice("")
    setPicture("");
    setCount("");
    setModalErrors(null);
  };

  const focus = () => setTimeout(() => nameInputRef.current!.focus(), 200);

  const addDialog = () => {
    setAddUpdate("Add");
    focus()
  };

  const editDialog = ({ id, name, price, count, description, picture, category }: any) => {
    setAddUpdate("Update");
    focus()
    setCategoryId(category.id)
    setId(id);
    setName(name);
    setPrice(price);
    setCount(count)
    setDescription(description);
    setPicture(picture)
  };

  const getPicture = (e: any) => {
    const file = e.target.files[0]
    var reader = new FileReader();
    reader.addEventListener("load", () => setPicture(reader.result as string), false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const prods = () => products.map(
    ({ id, name, description, picture, price, count, category }: IProduct) => {
      return (
        <tr key={id}>
          <td>
            <div className="d-flex align-items-center">
              <div className="ms-3">
                <p className="fw-bold mb-1">{name}</p>
              </div>
            </div>
          </td>
          <td>
            <p className="fw-normal mb-1">{description}</p>
          </td>
          <td>
            <p className="fw-normal mb-1">{category.name}</p>
          </td>
          <td>
            <p className="fw-normal mb-1">${price}</p>
          </td>
          <td>
            <p className="fw-normal mb-1">{count}</p>
          </td>
          <td>
            <button
              type="button"
              className="btn btn-primary btn-sm btn-rounded"
              data-bs-toggle="modal"
              data-bs-target="#productModal"
              onClick={() => editDialog({ id, name, description, picture, price, count, category })}
            >
              Edit
            </button>
          </td>
        </tr>
      );
    },
  );

  if (error) {
    return (
      <ServerError error={error} />
    )
  }

  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#productModal"
          style={{ margin: "7px 0" }}
          onClick={() => addDialog()}
        >
          Add Product
        </button>
        <div
          className="modal fade"
          id="productModal"
          data-bs-backdrop="static"
          aria-labelledby="productModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <form className="mx-1 mx-md-4" onSubmit={onSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="productModalLabel">
                    {addUpdate} Product
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={setDefault}
                  >
                  </button>
                </div>
                <div>
                  {modalErrors}
                </div>
                <div className="modal-body">
                  <div className="d-flex flex-row align-items-center mb-4">
                    <div className="form-outline flex-fill mb-0">
                      <input
                        ref={nameInputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        id="name"
                        placeholder="Name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center mb-4">
                    <div className="form-outline flex-fill mb-0">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description"
                        placeholder="Description"
                        className="form-control"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center mb-4">
                    <div className="form-outline flex-fill mb-0">
                      <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        type="text"
                        id="price"
                        placeholder="Price"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center mb-4">
                    <div className="form-outline flex-fill mb-0">
                      <input
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        type="text"
                        id="count"
                        placeholder="Count"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="d-flex flex-row align-items-center mb-4">
                      <div className="form-outline flex-fill mb-0">
                        <select
                          style={{ width: "418px" }}
                          className="form-select"
                          aria-label="Categories"
                          value={categoryId || 0}
                          onChange={(e: any) => setCategoryId(e.target.value)}>
                          <option key="0" value="0">--- Select Category ---</option>
                          {
                            categories.map((cat: ICategory) =>
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-outline flex-fill mb-0">
                      <label
                        htmlFor="formFileSm"
                        className="form-label">Choose Picture
                      </label>
                      <input
                        style={{ width: "418px" }}
                        className="form-control"
                        id="formFileSm"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={getPicture}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    {picture && <img src={picture} alt="picture" style={{ maxWidth: "420px" }} />}
                  </div>
                  {id &&
                    <div className="d-flex flex-row align-items-center mb-4">
                      <div className="form-outline flex-fill mb-0">
                        <input
                          type="checkbox"
                          onClick={(e: any) =>
                            setShouldDelete(e.target.checked)}
                        />{" "}
                        Delete
                      </div>
                    </div>
                  }
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary">{addUpdate}</button>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    className="btn btn-secondary"
                    onClick={setDefault}
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <table className="table align-middle mb-0 bg-white">
        <thead className="bg-light">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prods()}
        </tbody>
      </table>
    </>
  )
}

ProductsPage.getInitialProps = async (
  context: any,
  client: any,
  currentUser: ICurrentUser,
) => {
  try {
    const { catId } = context.ctx.query
    const { data: categories } = await client.get("/api/categories");

    const { data: products } = await client.get(`/api/products/user/${catId}`);
    return { error: null, categories, products, catId };
  } catch (error) {
    return { error };
  }
};

export default ProductsPage;