import Navbar from "./components/navbar/Navbar.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DAppProvider, Rinkeby, Kovan } from "@usedapp/core";
import Home from "./pages/Home.js";
import ErrorPage from "./pages/ErrorPage.js";
import Collection from "./pages/Collection.js";
import Asset from "./pages/Asset";

function App() {
  return (
    <DAppProvider config={{ networks: [Rinkeby, Kovan] }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/marketplace" element={<Home />} />
          <Route path="/profile/:username" element={<profile />} />
          <Route path="/collections/:collectionname" element={<Collection />} />
          <Route
            path="/collections/:collectionname/:asset"
            element={<Asset />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </DAppProvider>
  );
}

export default App;
