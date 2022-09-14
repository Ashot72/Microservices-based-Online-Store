import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import { ICart, ICurrentUser } from "../shared/interface";
import ServerError from "../shared/serverError";

export interface ICartPage {
  cart: ICart;
  error: null | { message: string }
  currentUser: ICurrentUser
}

const CartPage = ({ error, cart, currentUser }: ICartPage) => {
  const { doRequest: itemAddRemove, errors: itemAddRemoveErrors } = useRequest({
    url: `/api/cart/itemAddRemove`,
    method: "post",
    body: {},
    onSuccess: () => Router.push(`/cart`)
  });

  const { doRequest: itemRemove, errors: itemRemoveErrors } = useRequest({
    url: `/api/cart/itemRemove`,
    method: "post",
    body: {},
    onSuccess: () => Router.push(`/cart`)
  });

  const total = () => {
    if (cart && cart.info && cart.info.length > 0) {
      const totalCount: number[] = cart.info.map(a => a.qty * a.product.price)
      return totalCount.reduce((v, a) => v + a, 0)
    } else {
      return 0
    }
  }

  const { doRequest: payments, errors: paymentErrors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: { total: total() },
    onSuccess: () => Router.push("/payments")
  })

  const prods = () => {
    return cart.info.map(({ qty, limit, product: { id, name, description, picture, price } }) => {
      return (
        <div className="card mb-3" key={id}>
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-row">
                <div>
                  <img src={picture} alt={name} style={{ maxWidth: "420px" }} />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <div className="ms-3">
                  <h5 className="text-primary">{name} {limit && <span style={{ color: "red" }}>(max count reached)</span>}</h5>
                  <div className="small mb-0 text-secondary">{description}</div>
                  <div className="fw-bold mb-0 pe-3">Price: ${price}</div>
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <div style={{ width: "150px" }} className="d-flex flex-row">
                  <div>
                    <button className="btn btn-link px-2" style={{ marginTop: "-5px" }} onClick={() => itemAddRemove({ id, add: -1 })}>
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                  <h5 className="fw-normal mb-0">{qty}</h5>
                  <div>
                    <button className="btn btn-link px-2" style={{ marginTop: "-5px" }} onClick={() => itemAddRemove({ id, add: 1 })}>
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <a href="#!" style={{ color: "#cecece", marginTop: "-5px" }} onClick={() => itemRemove({ id })}>
                  <i className="fas fa-trash-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    );
  }


  if (error) {
    return (
      <ServerError error={error} />
    )
  }

  return (
    <>
      {itemAddRemoveErrors || itemRemoveErrors || paymentErrors}
      <div style={{ paddingTop: "10px" }}>
        {cart && cart.info && cart.info.length > 0 && prods()}
      </div>
      {cart && cart.info && cart.info.length > 0 &&
        <div className="card mb-3">
          <div className="me-3">
            <div className="d-flex justify-content-end align-items-center" style={{ height: "72px", marginRight: "16px" }}>
              <div style={{ marginRight: "10px" }}>Total:&nbsp;<b>${total()}</b></div>
              <StripeCheckout
                token={({ id }) => payments({ token: id })}
                amount={total() * 100}
                email={currentUser.email}
                stripeKey="pk_test_51KwPjRKVwzOYdWGqjhA8O5jQrUHXmSo8VVJaaOBsEROZKOKqsxNzind6nj1mUTcw68MRXOHxQblzEwc8hv3CxSPT00xDuqVkzU"
              />
            </div>
          </div>
        </div>
      }
    </>
  )
}

CartPage.getInitialProps = async (
  context: any,
  client: any,
  currentUser: ICurrentUser,
) => {
  try {
    const { data: cart } = await client.get('/api/cart')
    return { error: null, cart, currentUser }
  } catch (error) {
    return { error }
  }
}

export default CartPage;