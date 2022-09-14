import * as React from 'react'
import { useState } from "react";
import Router from "next/router";

import useRequest from "../hooks/use-request";

interface IAuth {
  title: string
  endPoint: string
}

const Auth: React.FC<IAuth> = ({ title, endPoint }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { doRequest, errors } = useRequest({
    url: `/api/users/${endPoint}`,
    method: "post",
    body: {
      email, password
    },
    onSuccess: () => Router.push("/")
  })

  const onSubmit = async (event: any) => {
    event.preventDefault()
    doRequest()
  }

  return (
    <div className="container h-100" style={{ padding: "10px" }}>
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="card-body p-md-5">
          <div className="row justify-content-center">
            {errors}
            <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                {title}
              </p>
              <form className="mx-1 mx-md-4" onSubmit={onSubmit}>
                <div className="d-flex flex-row align-items-center mb-4">
                  <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      type="email"
                      id="email"
                      placeholder='Email'
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                  <div className="form-outline flex-fill mb-0">
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type="password"
                      id="password"
                      placeholder='Password'
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                  <button className="btn btn-primary btn-lg">
                    {title}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth
