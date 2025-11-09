import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage setUser={setUser} />} />
            <Route path="*" element={<LoginPage setUser={setUser} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
            <Route path="/cart" element={<CartPage user={user} setUser={setUser} />} />
            <Route path="/checkout" element={<CheckoutPage user={user} setUser={setUser} />} />
            <Route path="*" element={<HomePage user={user} setUser={setUser} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
