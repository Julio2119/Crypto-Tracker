import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Domination from "./pages/Domination";
import FearGreed from "./pages/FearGreed";
import FundingRates from "./pages/FundingRates";
function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <Home />
        </>
      ),
    },
    {
      path: "/Domination",
      element: (
        <>
          <Navbar />
          <Domination />
        </>
      ),
    },
    {
      path: "/FearGreed",
      element: (
        <>
          <Navbar />
          <FearGreed />
        </>
      ),
    },
    {
      path: "/FundingRates",
      element: (
        <>
          <Navbar />
          <FundingRates />
        </>
      ),
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
