import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.css'
import { useEffect } from "react";

import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, pathName, currentUser }: any) => {

  useEffect(() => {
    // @ts-ignore
    import("bootstrap/dist/js/bootstrap.min.js");
  }, []);

    return (
    <div>
      <Header currentUser={currentUser} pathName={pathName} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext: any) => {
  const client = buildClient(appContext.ctx);

  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext,
      client,
      data.currentUser,
    );
  }

  return {
    pageProps,
    pathName: appContext.ctx.pathname,
    ...data,
  };
};

export default AppComponent;
