import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f4f6;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #4a90e2;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #357abd;
  }
`;

const SwitchFormText = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #777;
`;

const SwitchLink = styled(Link)`
  color: #4a90e2;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const { login, authStatus } = useContext(AuthContext); // Use authStatus from context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password); // Wait for the login to complete
      if (authStatus) {
        navigate("/"); // Redirect on successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally handle login failure here
    }
  };

  return (
    <LoginContainer>
      <FormWrapper>
        <FormTitle>Login</FormTitle>
        <form onSubmit={handleSubmit}>
          <StyledInput type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <StyledInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <StyledButton type="submit">Log In</StyledButton>
        </form>
        <SwitchFormText>
          Don't have an account? <SwitchLink to="/signup">Sign Up</SwitchLink>
        </SwitchFormText>
      </FormWrapper>
    </LoginContainer>
  );
};

export default Login;
