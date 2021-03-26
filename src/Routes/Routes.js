import * as React from "react";
import LoginPage from "../Components/Login/LoginPage";
import Dashboard from "../Components/Dashboard/Dashboard";
import { Route, Switch } from 'react-router-dom';

const Routes = _ => {
//   const { t } = useResource();
//   const login = `/${t(Resources.Routes.Login)}`;
//   const products = `/${t(Resources.Routes.Products)}`;¨

  return (
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route path="/login">
          <LoginPage />
        </Route>
      </Switch>
  );
};

export { Routes };
