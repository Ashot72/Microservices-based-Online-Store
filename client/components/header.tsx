import Link from 'next/link'

interface IHeader {
    currentUser: { email: string }
    pathName: string
}

export default ({ currentUser, pathName }: IHeader) => {

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <div style={{ marginLeft: "250px" }}></div>
                </a>
                <button className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link href={"/"}>
                                <a className={`nav-link ${pathName === "/" ? "active" : ""}`} aria-current="page">Home</a>
                            </Link>
                        </li>
                        {
                            currentUser &&
                            <li className="nav-item">
                                <Link href={"/categories"}>
                                    <a className={`nav-link ${pathName === "/categories" ? "active" : ""}`}>Categories</a>
                                </Link>
                            </li>
                        }
                        {
                            currentUser &&
                            <li className="nav-item">
                                <Link href={"/cart"}>
                                    <a className={`nav-link ${pathName === "/cart" ? "active" : ""}`}>Shopping Cart</a>
                                </Link>
                            </li>
                        }
                        {
                            currentUser &&
                            <li className="nav-item">
                                <Link href={"/payments"}>
                                    <a className={`nav-link ${pathName === "/payments" ? "active" : ""}`}>Orders</a>
                                </Link>
                            </li>
                        }
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {
                            currentUser
                                ? (
                                    <li>
                                        <a className="nav-link" role="button" href="/auth/signout">{currentUser.email} | Sign Out</a>
                                    </li>
                                ) : (
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">Account</a>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                            <li><a className="dropdown-item" href="/auth/signin">Login</a></li>
                                            <li><a className="dropdown-item" href="/auth/register">Register</a></li>
                                        </ul>
                                    </li>
                                )
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}