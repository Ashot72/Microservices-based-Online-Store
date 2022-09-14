import { useRef } from "react";
import { ICurrentUser } from "../shared/interface";
import { useEffect, useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import ServerError from "../shared/serverError";
import { ICategory } from "../shared/interface";

interface ICategoriesPage {
  currentUer: ICurrentUser;
  categories: ICategory[];
  error: null | { message: string }
}

const CategoriesPage = ({ categories, error }: ICategoriesPage) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shouldDelete, setShouldDelete] = useState(false);
  const [addUpdate, setAddUpdate] = useState("");
  const [modalErrors, setModalErrors] = useState(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { doRequest, errors } = useRequest({
    url: (shouldDelete || id) ? `/api/categories/${id}` : `/api/categories`,
    method: shouldDelete ? "delete" : id ? "put" : "post",
    body: {
      name,
      description,
    },
    onSuccess: () => {
      closeBtnRef.current!.click();
      setDefault();
      Router.push("/categories");
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
    setDescription("");
    setModalErrors(null);
  };

  const focus = () => setTimeout(() => nameInputRef.current!.focus(), 200);

  const addDialog = () => {
    setAddUpdate("Add");
    focus()
  };

  const editDialog = ({ id, name, description }: ICategory) => {
    setAddUpdate("Update");
    focus()
    setId(id);
    setName(name);
    setDescription(description);
  };

  const cats = () => categories.map(
    ({ id, name, description, userId }: ICategory) => {
      return (
        <tr key={id}>
          <td style={{ width: "33%" }}>
            <div className="fw-bold mb-1">{name}</div>
          </td>
          <td style={{ width: "33%" }}>
            <div className="mb-1">{description}</div>
          </td>
          <td>
            <div className="align-items-center">
              <button
                type="button"
                className="btn btn-primary btn-sm btn-rounded"
                data-bs-toggle="modal"
                data-bs-target="#categoryModal"
                onClick={() => editDialog({ id, name, description, userId })}
              >
                Edit
              </button>&nbsp;
              <button
                type="button"
                className="btn btn-primary btn-sm btn-rounded"
                onClick={() => Router.push("/products/[id]", `/products/${id}`)}
              >
                View Products
              </button>
            </div>
          </td>
        </tr >
      );
    }
  )

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
          data-bs-target="#categoryModal"
          style={{ margin: "7px 0" }}
          onClick={() => addDialog()}
        >
          Add Category
        </button>
        <div
          className="modal fade"
          id="categoryModal"
          data-bs-backdrop="static"
          aria-labelledby="categoryModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <form className="mx-1 mx-md-4" onSubmit={onSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="categoryModalLabel">
                    {addUpdate} Category
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
                        type="name"
                        id="name"
                        placeholder="Name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center mb-4">
                    <div className="form-outline flex-fill mb-0">
                      <textarea
                        defaultValue={description}
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
                      {id &&
                        (
                          <>
                            <input
                              type="checkbox"
                              onClick={(e: any) =>
                                setShouldDelete(e.target.checked)}
                            />{" "}
                            Delete
                          </>
                        )}
                    </div>
                  </div>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cats()}
        </tbody>
      </table>
    </>
  );
};

CategoriesPage.getInitialProps = async (
  context: any,
  client: any,
  currentUser: ICurrentUser,
) => {

  try {
    const { data } = await client.get("/api/categories");
    return { categories: data };
  } catch (error) {
    return { categories: null, error };
  }
};

export default CategoriesPage;
