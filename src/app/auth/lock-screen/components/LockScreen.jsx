import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// ✅ Alwijha Logo (Arabic + English)
import alwijhaLogo from '@/assets/images/app-calendar/alwijha.webp';

const SignIn = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

  const schema = yup.object({
    email: yup.string().email().required('Please enter email'),
    password: yup.string().required('Please enter password')
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5}>
            <Card className="auth-card">
              <CardBody className="px-3 py-5">

                {/* ✅ LOGO (SAME AS SIGN UP) */}
                <div className="mx-auto mb-4 text-center auth-logo">
                  <img
                    src={alwijhaLogo}
                    alt="Alwijha Real Estate"
                    style={{
                      height: '60px',
                      width: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                <h2 className="fw-bold text-uppercase text-center fs-18">
                  Sign In
                </h2>

                <p className="text-muted text-center mt-1 mb-4">
                  Enter your email address and password to access admin panel.
                </p>

                <div className="px-4">
                  <form
                    onSubmit={handleSubmit(() => {})}
                    className="authentication-form"
                  >
                    <div className="mb-3">
                      <TextFormInput
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        className="bg-light bg-opacity-50 border-light py-2"
                      />
                    </div>

                    <div className="mb-3">
                      <TextFormInput
                        control={control}
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        className="bg-light bg-opacity-50 border-light py-2"
                      />
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="remember-me"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="remember-me"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="mb-1 text-center d-grid">
                      <button className="btn btn-danger py-2" type="submit">
                        Sign In
                      </button>
                    </div>
                  </form>

                  <p className="mt-3 fw-semibold no-span">
                    OR sign in with
                  </p>

                  <div className="text-center">
                    <Button variant="outline-light" className="shadow-none">
                      <IconifyIcon icon="bxl:google" className="fs-20" />
                    </Button>
                    &nbsp;
                    <Button variant="outline-light" className="shadow-none">
                      <IconifyIcon icon="ri:facebook-fill" height={32} width={20} />
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
              New here?{' '}
              <Link
                to="/auth/sign-up"
                className="text-reset text-unline-dashed fw-bold ms-1"
              >
                Sign Up
              </Link>
            </p>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignIn;
