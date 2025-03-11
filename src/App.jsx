import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Categories from "../src/pages/categories/Categories";
import Product from "../src/pages/product/Product";

function App() {
  console.log("The app is running in", import.meta.env.MODE, "mode");
  return (
    <>
      <Navbar />
      <Routes>
        {/* Redirección de la ruta base a "categorias" */}
        <Route path="/" element={<Navigate to="/categorias" />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/productos" element={<Product />} />
      </Routes>
    </>
  );
}

export default App;
