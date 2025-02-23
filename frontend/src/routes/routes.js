import React from 'react';
import { Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../components/NotFound';

const AllRoutes = () => (
  <>
    <Route exact path="/" component={Login} />
    <Route path="/login" component={Login} />
    <Route path="/admin/*" component={Dashboard} />
    <Route component={NotFound} /> {}
  </>
);

export default AllRoutes;
