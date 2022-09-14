import { ICurrentUser, IPayments } from "../shared/interface";
import ServerError from "../shared/serverError";

export interface IPaymentsPage {
    payments: IPayments[];
    error: null | { message: string }
}

const PaymentsPage = ({ error, payments }: IPaymentsPage) => {

    const prods = () => {
        return payments.map((payment) => {
            return payment.info.map(({ qty, product: { id, name, description, picture, price } }) => {
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
                                        <h5 className="text-primary">{name}</h5>
                                        <div className="small mb-0 text-secondary">{description}</div>
                                        <div className="fw-bold mb-0 pe-3">Price: ${price}</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-row align-items-center">
                                    <div style={{ width: "150px" }} className="d-flex flex-row">

                                        <h5 className="fw-normal mb-0">Qty: {qty}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            );
        })
    }

    if (error) {
        return (
            <ServerError error={error} />
        )
    }

    return (
        <>
            <div style={{ paddingTop: "10px" }}>
                {payments && prods()}
            </div>
        </>
    )
}

PaymentsPage.getInitialProps = async (
    context: any,
    client: any,
    currentUser: ICurrentUser,
) => {
    try {
        const { data: payments } = await client.get('/api/payments')

        return { error: null, payments }
    } catch (error) {
        return { error }
    }
}

export default PaymentsPage;