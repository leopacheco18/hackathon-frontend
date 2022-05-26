import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/global/Header";
// import Footer from "./components/global/Footer";
import Home from "./pages/home/Home";
import CreateAccount from "./pages/createAccount/CreateAccount";
import CertificateOverview from "./pages/certificateOverview/CertificateOverview";
import NewCertificate from "./pages/newCertificate/NewCertificate";
import IssueCertificate from "./pages/issueCertificate/IssueCertificate";
import NewCourse from "./pages/newCourse/NewCourse";
import CourseDetails from "./pages/courseDetails/CourseDetails";
import Holder from "./pages/holder/Holder";

function App() {
  return (
    <Router>
      <Header />
      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/createAccount" element={<CreateAccount />}></Route>
        <Route path="/holder" element={<Holder />}></Route>
        <Route
          path="/newCertificate/:contractAddress"
          element={<NewCertificate />}
        ></Route>
        <Route path="/newCourse" element={<NewCourse />} />
        <Route
          path="/courseDetails/:contractAddress"
          element={<CourseDetails />}
        ></Route>
        <Route
          path="/issueCertificate/:contractAddress"
          element={<IssueCertificate />}
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
