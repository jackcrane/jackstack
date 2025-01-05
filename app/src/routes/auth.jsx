import { Card, Flex, Input, Link, Stack, Tabs, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input";
import { useState } from "react";
import { useAuth } from "../../hooks";

const computePasswordStrength = (password) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let strength = 0;

  if (hasUppercase) {
    strength += 1;
  }

  if (hasLowercase) {
    strength += 1;
  }

  if (hasNumber) {
    strength += 1;
  }

  if (hasSpecial) {
    strength += 1;
  }

  return strength;
};

const compressZodError = (error) => {
  if (typeof error === "string") {
    return error;
  }

  let res = "";

  if (error.length === 1) {
    res = error[0].message;
  }
  res = error.map((issue) => issue.message).join(", ");
  console.log(res);
  return res;
};

export const Auth = () => {
  return (
    <Flex align="center" justify="center" pt="100px" flex="1" w="md" mx="auto">
      <Tabs.Root defaultValue="login" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="login" asChild>
            <Link>Log in</Link>
          </Tabs.Trigger>
          <Tabs.Trigger value="register" asChild>
            <Link>Register</Link>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="login">
          <Login />
        </Tabs.Content>
        <Tabs.Content value="register">
          <Register />
        </Tabs.Content>
      </Tabs.Root>
    </Flex>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, mutationLoading, error } = useAuth();

  return (
    <Card.Root maxW="sm" w="md">
      <Card.Header>
        <Card.Title>Log in</Card.Title>
        <Card.Description>Welcome back!</Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="4" w="full">
          {error && (
            <Alert
              status="error"
              variant="surface"
              title={compressZodError(error)}
            />
          )}
          <Field label="Email">
            <Input
              value={email}
              type="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field
            label="Password"
            invalid={
              (password.length < 8 || password.length > 128) && !!password
            }
            invalidText="Password must be at least 8 characters"
          >
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button
          loading={mutationLoading}
          onClick={() => login({ email, password })}
        >
          Sign in
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register, registered, mutationLoading, error } = useAuth();

  return (
    <Card.Root maxW="sm" w="md">
      <Card.Header>
        <Card.Title>Register</Card.Title>
        <Card.Description>
          Fill in the form below to create an account
        </Card.Description>
      </Card.Header>
      {registered ? (
        <>
          <Card.Body>
            <Alert status="success" variant="surface" title="Account created!">
              Your account has been created. Please check your email for a
              confirmation link in order to continue.
            </Alert>
          </Card.Body>
        </>
      ) : (
        <>
          <Card.Body>
            <Stack gap="4" w="full">
              {error && (
                <Alert
                  status="error"
                  variant="surface"
                  title={compressZodError(error)}
                />
              )}
              <Field label="Name">
                <Input
                  value={name}
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </Field>
              <Field label="Email">
                <Input
                  value={email}
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field
                label="Password"
                invalid={
                  (password.length < 8 || password.length > 128) && !!password
                }
                invalidText="Password must be at least 8 characters"
              >
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordStrengthMeter
                  value={computePasswordStrength(password)}
                  w="100%"
                />
              </Field>
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="flex-end">
            <Button
              variant="solid"
              loading={mutationLoading}
              onClick={() => register({ name, email, password })}
            >
              Register
            </Button>
          </Card.Footer>
        </>
      )}
    </Card.Root>
  );
};
