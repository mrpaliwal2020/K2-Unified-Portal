import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Phone } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../routes/routeConfig";
import useAuthStore from "../../store/authStore";
import { validateMobile } from "../../utils/validators";
import Header from "../../components/Common/Header";
import { CONTENT } from "../../constants/content";
import {
  Button,
  Card,
  Input,
  AuthLayout,
  AuthHeader,
  PhoneInputGroup,
  FormError,
} from "../../components/ui";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuthStore();
  const { sendOTP, isLoading, error, clearError } = useAuth();

  const [mobile, setMobile] = useState("");
  const [mobileErr, setMobileErr] = useState("");

  if (isLoggedIn && role) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(val);
    if (mobileErr) setMobileErr("");
    if (error) clearError();
  };

  const handleSubmit = async () => {
    const err = validateMobile(mobile);
    if (err) {
      setMobileErr(err);
      return;
    }
    const result = await sendOTP(mobile);
    if (result.success) navigate(ROUTES.OTP, { state: { mobile } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const LogoIcon = () => (
    <img
      src="/Images/Krishi-Kutumb - logo.jpeg"
      alt="Krishi Kutumb"
      className="w-full h-full object-cover rounded-full"
    />
  );

  return (
    <AuthLayout>
      <AuthHeader
        icon={LogoIcon}
        title={CONTENT.auth.login.title}
        subtitle={CONTENT.auth.login.subtitle}
      />

      <Card className="w-full max-w-md p-8 border-none shadow-lg">
        <PhoneInputGroup countryCode={CONTENT.auth.login.countryCode} error={mobileErr || error}>
          <Input
            type="tel"a
            value={mobile}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={CONTENT.auth.login.inputPlaceholder}
            className="border-none shadow-none focus-visible:ring-0 px-4 py-4 flex-1 text-sm bg-transparent"
            autoFocus
          />
        </PhoneInputGroup>

        <FormError error={mobileErr || error} prefix={CONTENT.auth.login.errorPrefix} />

        <Button
          onClick={handleSubmit}
          disabled={mobile.length < 10 || isLoading}
          variant={mobile.length === 10 ? "primary" : "secondary"}
          className="w-full py-4 rounded-xl text-sm transition-all duration-200"
        >
          {isLoading ? CONTENT.auth.login.buttonLoadingText : CONTENT.auth.login.buttonText}
        </Button>
      </Card>

      <div id="recaptcha-container" />
    </AuthLayout>
  );
};

export default Login;