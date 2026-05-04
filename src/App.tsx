import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import About from "./pages/About";
import Home from "./pages/Home";
import PlaceholderPage from "./pages/PlaceholderPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route
          path="portfolio"
          element={<PlaceholderPage title="Portfolio" />}
        />
        <Route
          path="photography"
          element={<PlaceholderPage title="Photography" />}
        />
      </Route>
    </Routes>
  );
}
