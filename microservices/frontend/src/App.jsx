import React, { Component} from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/login";
// import Test from "./components/Test";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Register from "./components/register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

class App extends Component{
  render(){
    return(
      <div className="App">
        <RouterProvider router={router} />
        {/* <Test /> */}
      </div>
    );
  }
}

export default App;