import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ContentQueue from './ContentQueue';
import StrapiPosts from './StrapiPosts';
import Financials from './Financials';
import './DataPane.css';

const DataPane = () => (
  <div className="data-pane">
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/content-queue" component={ContentQueue} />
      <Route path="/strapi-posts" component={StrapiPosts} />
      <Route path="/financials" component={Financials} />
    </Switch>
  </div>
);

export default DataPane;
