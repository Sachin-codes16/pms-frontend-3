import TextFormInput from '@/components/from/TextFormInput';
import PasswordFormInput from '@/components/from/PasswordFormInput';
import { useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import useSignIn from '../useSignIn';

// ✅ Logo
import alwijhaLogo from '@/assets/images/app-calendar/alwijha.webp';

const SignIn = () => {
  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

  const { loading, login, control, error } = useSignIn();

  return (
    <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5}>
            <Card className="auth-card shadow">
              <CardBody className="px-4 py-5">

                {/* ✅ LOGO */}
                <div className="text-center mb-4">
                  <img
                    src={alwijhaLogo}
                    alt="Alwijha Real Estate"
                    style={{ height: '60px' }}
                  />
                </div>

                <h4 className="text-center fw-semibold mb-4">
                  SIGN IN
                </h4>

                {error && (
                  <div className="alert alert-danger text-center py-2 fs-14" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={login}>

                  <div className="mb-3">
                    <TextFormInput
                      control={control}
                      name="username"
                      label="Username"
                      placeholder="Enter your Username"
                      className="bg-light border-light py-2"
                    />
                  </div>

                  <div className="mb-3">
                    <PasswordFormInput
                      control={control}
                      name="password"
                      label="Enter Password"
                      placeholder="Enter your Password"
                      className="bg-light border-light py-2"
                    />
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>

                  {/* ✅ SAME DARK BUTTON AS FIRST SCREENSHOT */}
                  <div className="d-grid">
                    <Button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: '#2f3542',
                        border: 'none',
                        padding: '10px'
                      }}
                    >
                      Sign In
                    </Button>
                  </div>

                </form>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignIn;
