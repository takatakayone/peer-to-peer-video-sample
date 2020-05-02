import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Layout } from "./component/Layout";
import App from './component/App';
import { Index } from "./component/GoogleBooks";

export const Path = {
    app: '/',
    otameshi: '/otameshi',
};

const routes = (
 <Layout>
    <Switch>
      <Route exact path={Path.app} component={App} />
      <Route exact path={Path.otameshi} component={Index} />
      <Redirect to={Path.app} />
    </Switch>
 </Layout>
);

export default routes;
