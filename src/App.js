import React, { useState, useEffect } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { HashRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { useEagerConnect, useInactiveListener } from "./hooks";
import Spinner from "./components/Spinner/Spinner";
import AppLayout from "./components/AppLayout";

import "./App.css";
import TGEModal from "./views/Modal/Modal";

const App = () => {
  const [activatingConnector, setActivatingConnector] = useState();

  const { account, error, active, connector } = useWeb3React();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useEffect(() => {
    if (account && active && !error) {
      // history.push("/dashboard");
    }
  }, [account, active, error]);

  return (
    <React.Suspense fallback={<Spinner />}>
      <HashRouter>
        <AppLayout>
          <Switch>
            <Route
              exact
              path="/"
              component={React.lazy(() =>
                import("./views/Dashboard/Dashboard")
              )}
            />

            <Route
              exact
              path="/options/:contractAddress"
              component={React.lazy(() => import("./views/Option/Option"))}
            />

            <Route
              exact
              path="/add-option"
              component={React.lazy(() =>
                import("./views/AddOption/AddOption")
              )}
            />
          </Switch>
          <TGEModal show={!!error}>
            <div className="mb-2">
              <div className="row mt-4 text-center ml-auto mr-auto wrong-network">
                {error instanceof UnsupportedChainIdError ? (
                  <h5>Please connect to the appropriate ERC20 network.</h5>
                ) : (
                  <h5>Error connecting. Try refreshing the page.</h5>
                )}
              </div>
            </div>
          </TGEModal>
          <ToastContainer />
        </AppLayout>
      </HashRouter>
    </React.Suspense>
  );
};

export default App;
