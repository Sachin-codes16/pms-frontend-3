import TextFormInput from "@/components/from/TextFormInput";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import httpClient from "@/helpers/httpClient";
import { API_BASE_URL, setAuthToken } from "@/constants/api";
import { useAuthContext } from "@/context/useAuthContext";
import { useNotificationContext } from "@/context/useNotificationContext";

// ✅ Alwijha Logo
import alwijhaLogo from "@/assets/images/app-calendar/alwijha.webp";

const SignUp = () => {
  useEffect(() => {
    document.body.classList.add("authentication-bg");
    return () => {
      document.body.classList.remove("authentication-bg");
    };
  }, []);

  const messageSchema = yup.object({
    name: yup.string().required("Please enter Name"),
    email: yup.string().email().required("Please enter Email"),
    password: yup.string().required("Please enter password"),
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(messageSchema),
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { saveSession } = useAuthContext();
  const { showNotification } = useNotificationContext();

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await httpClient.post(`${API_BASE_URL}/auth/register/`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      const data = res.data;
      // If API returns token, sign the user in automatically
      if (data?.token) {
        setAuthToken(data.token);
        saveSession(data);
        showNotification({
          message: "Account created and signed in",
          variant: "success",
        });
        navigate("/");
        return;
      }

      showNotification({
        message: "Account created. Please sign in.",
        variant: "success",
      });
      navigate("/auth/sign-in");
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e?.message ||
        "Signup failed.";
      showNotification({ message: msg, variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5}>
            <Card className="auth-card">
              <CardBody className="px-3 py-5">
                {/* ✅ LOGO REPLACED HERE */}
                <div className="mx-auto mb-4 text-center auth-logo">
                  <img
                    src={alwijhaLogo}
                    alt="Alwijha Real Estate"
                    style={{
                      height: "60px",
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <h2 className="fw-bold text-uppercase text-center fs-18">
                  Free Account
                </h2>

                <p className="text-muted text-center mt-1 mb-4">
                  New to our platform? Sign up now! It only takes a minute.
                </p>

                <div className="px-4">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="authentication-form"
                  >
                    <div className="mb-3">
                      <TextFormInput
                        control={control}
                        name="name"
                        placeholder="Enter your Name"
                        className="bg-light bg-opacity-50 border-light py-2"
                        label="Username"
                      />
                    </div>

                    <div className="mb-3">
                      <TextFormInput
                        control={control}
                        name="email"
                        placeholder="Enter you password"
                        className="bg-light bg-opacity-50 border-light py-2"
                        label="Enter you password"
                      />
                    </div>

                    <div className="mb-3">
                      <TextFormInput
                        control={control}
                        name="password"
                        placeholder="Enter your password"
                        className="bg-light bg-opacity-50 border-light py-2"
                        label="Password"
                      />
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="checkbox-signup"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="checkbox-signup"
                        >
                          I accept Terms and Condition
                        </label>
                      </div>
                    </div>

                    <div className="mb-1 text-center d-grid">
                      <button
                        className="btn btn-danger py-2"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Account"}
                      </button>
                    </div>
                  </form>

                  <p className="mt-3 fw-semibold no-span">OR sign with</p>

                  <div className="text-center">
                    <Button variant="outline-light" className="shadow-none">
                      <IconifyIcon icon="bxl:google" className="fs-20" />
                    </Button>
                    &nbsp;
                    <Button variant="outline-light" className="shadow-none">
                      <IconifyIcon
                        icon="ri:facebook-fill"
                        height={32}
                        width={20}
                      />
                    </Button>
                    &nbsp;
                    <Button variant="outline-light" className="shadow-none">
                      <IconifyIcon icon="bxl:github" className="fs-20" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <p className="mb-0 text-center text-white">
              I already have an account{" "}
              <Link
                to="/auth/sign-in"
                className="text-reset text-unline-dashed fw-bold ms-1"
              >
                Sign In
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
