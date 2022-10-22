import { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/userContext";

// import ImgDumbMerch from "../assets/DumbMerch.png";
import Logo from "../assets/Logo.png"

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

export default function Auth() {
  let navigate = useNavigate();

  const [state] = useContext(UserContext);

  const checkAuth = () => {
    if (state.isLogin === true) {
      navigate("/");
    }
  };
  checkAuth();

  const [isRegister, setIsRegister] = useState(false);

  const switchLogin = () => {
    setIsRegister(false);
  };

  const switchRegister = () => {
    setIsRegister(true);
  };

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex align-items-center">
          <Col md="6">
            <img src={Logo} className="img-fluid" style={{ width: "564px", height: "230px" }} alt="brand" />
            <div className="text-auth-header mt-4">Simplifying Mobility with Integration</div>
            {/* <p className="text-auth-parag mt-3">
              Simplifying Mobility with Integration
            </p> */}
            <div className="mt-5">
              <button onClick={switchLogin} className="btn btn-login px-5 me-2">
                Login
              </button>
              <button onClick={switchRegister} className="btn btn-register px-5">
                Register
              </button>
            </div>
          </Col>
          <Col md="6">{isRegister ? <Register /> : <Login />}</Col>
        </Row>
      </Container>
    </div>
  );
}
