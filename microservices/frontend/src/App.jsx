import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Login from "./components/login";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Register from "./components/register";
import PublicDashboard from "./components/public-dashboard";
import PrivateDashboard from "./components/private-dashboard";
import axios from "axios";
import { URLS } from "./utils";

const publicPathLoader = async () => {
  try {
    const isLoggedIn = await axios.post(URLS.IS_LOGGED_IN);
    return redirect("/private/dashboard");
  } catch (error) {
    return null;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicDashboard />,
    loader: publicPathLoader,
  },
  {
    path: "/login",
    element: <Login />,
    loader: publicPathLoader,
  },
  {
    path: "/register",
    element: <Register />,
    loader: publicPathLoader,
  },
  {
    path: "/private",
    loader: async () => {
      try {
        const isLoggedIn = await axios.post(URLS.IS_LOGGED_IN);
      } catch (error) {
        toast.info("Please login");
        return redirect("/");
      }
      return null;
    },
    children: [
      {
        path: "dashboard",
        element: <PrivateDashboard />,
      },
    ],
  },
]);

class App extends Component {
  render() {
    return (
      <div className="App container">
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
