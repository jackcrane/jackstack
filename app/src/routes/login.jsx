import { useState } from "react";
import { useAuth } from "../../hooks";
import { Button, Card, Typography, Input, Alert } from "tabler-react-2";
import { Header } from "../../components/header";
import { Page } from "../../components/page";
import styled from "styled-components";
import { Grow, Row } from "../../util/Flex";
import { Spacer } from "../../util/Spacer";
const { H1, Text } = Typography;

export const Login = () => {
  const { login, mutationLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Page title="Log in">
      <LoginCard>
        <Typography.H1>Log in to your account</Typography.H1>
        <Text>
          Welcome back! Please enter your email and password to log in.
        </Text>
        <Typography.Link href="/register">
          Don't have an account? Register here.
        </Typography.Link>
        <Spacer size={2} />
        {error && (
          <>
            <Alert variant="danger" title={"Error"}>
              {error}
            </Alert>
          </>
        )}
        <Input
          label="Email"
          placeholder="Email"
          name="email"
          onInput={setEmail}
          value={email}
        />
        <Input
          label="Password"
          placeholder="Password"
          type="password"
          name="password"
          onInput={setPassword}
          value={password}
        />
        <Row justify="none" gap={2}>
          <Grow />
          <Typography.Link href="/forgot-password">
            Forgot password?
          </Typography.Link>
          <Button
            loading={mutationLoading}
            onClick={() => login({ email, password })}
          >
            Log in
          </Button>
        </Row>
      </LoginCard>
    </Page>
  );
};

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: auto;
  margin-top: 20px;
`;
