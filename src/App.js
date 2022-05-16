import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/global/Header";
// import Footer from "./components/global/Footer";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import CreateAccount from "./pages/createAccount/CreateAccount";
import CertificateOverview from "./pages/certificateOverview/CertificateOverview";
import CertificateDetails from "./pages/certificateDetails/CertificateDetails";
import NewCertificate from "./pages/newCertificate/NewCertificate";
import IssueCertificate from "./pages/issueCertificate/IssueCertificate";

function App() {
  return (
    <Router>
      <Header />
      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/createAccount" element={<CreateAccount />}></Route>
        <Route path="/newCertificate" element={<NewCertificate />}></Route>
        <Route
          path="/issueCertificate/:contractAddress"
          element={<IssueCertificate />}
        ></Route>
        <Route
          path="/certificateDetails/:contractAddress"
          element={<CertificateDetails />}
        ></Route>
        <Route
          path="/certificateOverview"
          element={<CertificateOverview />}
        ></Route>
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
