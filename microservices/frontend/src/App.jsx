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
import Search from "./components/private-dashboard/search";
import axios from "axios";
import { URLS } from "./utils";
import BoardsList from "./components/private-dashboard/boards-list";
import store from "./redux/store";
import { setStarredBoardsAction } from "./redux/actions/starredBoards";
import { setUserDetailsAction } from "./redux/actions/user";
import Profile from "./components/private-dashboard/profile";
import Loader from "./components/loader";

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
    element: <PrivateDashboard />,
    loader: async () => {
      try {
        const response = await axios.post(URLS.IS_LOGGED_IN);
        if (response.status === 200) {
          const { _id, starred = [], image } = response.data;
          store.dispatch(setStarredBoardsAction(starred));
          store.dispatch(
            setUserDetailsAction({
              _id,
              image,
            })
          );
        } else {
          throw new Error("Invalid response status ", response.status);
        }
      } catch (error) {
        toast.info("Please login");
        return redirect("/");
      }
      return null;
    },
    children: [
      {
        path: "dashboard",
        element: <BoardsList tab="my-boards" />,
      },
      {
        path: "shared-with-me",
        element: <BoardsList tab="shared-with-me" />,
      },
      {
        path: "starred",
        element: <BoardsList tab="starred" />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "recent",
        element: <BoardsList tab="recent" />,
      },
      {
        path: "trash",
        element: <BoardsList tab="trash" />,
      },
      {
        path: "search",
        element: <BoardsList tab="search" />
      }
    ],
  },
]);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Loader />
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
