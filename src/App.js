import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/global/Header";
// import Footer from "./components/global/Footer";
import Home from "./pages/home/Home";

function App() {
  return (
    <Router>
      {/* <Header /> */}

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
