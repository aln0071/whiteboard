import React, { Component } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Login from "./components/login";
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from "react-router-dom";
import Register from "./components/register";
import PublicDashboard from "./components/public-dashboard";
import PrivateDashboard from "./components/private-dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicDashboard />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/private',
    loader: async () => {
      const accessToken = window.localStorage.getItem('accessToken')
      if(accessToken === undefined || accessToken === null) {
        toast.info('Please login')
        return redirect('/')
      } else {
        return accessToken;
      }
    },
    children: [
      {
        path: 'dashboard',
        element: <PrivateDashboard />
      }
    ]
  }
]);

class App extends Component {
  render() {
    return (
      <div className="App">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <RouterProvider router={router} />
      </div>
    );
  }
}

export default App;