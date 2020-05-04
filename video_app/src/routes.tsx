import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Layout } from "./component/Layout";
import App from './component/App';
import { Room } from "./component/Rooms";

export const Path = {
    app: '/',
    room: '/rooms/:roomId',
};

const routes = (
 <Layout>
    <Switch>
      <Route exact path={Path.app} component={App} />
      <Route path={Path.room} component={Room}/>
      <Redirect to={Path.app} />
    </Switch>
 </Layout>
);

export default routes;
