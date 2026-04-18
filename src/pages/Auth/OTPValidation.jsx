import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Edit2, Lock, Unlock } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../routes/routeConfig";
import { maskMobile } from "../../utils/formatters";
import { CONTENT } from "../../constants/content";
import { Button, Card, Input, AuthLayout, PageTitle, FormError, InfoBadge } from "../../components/ui";

const OTP_LENGTH = 6;

const OTPValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = location.state?.mobile || "";

  const { verifyOTP, resendOTP, isLoading, error, clearError, resendTimer } =
    useAuth();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!mobile) navigate(ROUTES.LOGIN, { replace: true });
  }, [mobile]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    if (error) clearError();

    const newOtp = [...otp];

    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
      digits.split("").forEach((d, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  const handleVerify = async () => {
    const otpStr = otp.join("");
    if (otpStr.length < OTP_LENGTH) return;
    await verifyOTP(otpStr, mobile);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
    await resendOTP(mobile);
  };

  const otpFilled = otp.every((d) => d !== "");
  return (
    <AuthLayout>
      <Card className="w-full max-w-md p-8 animate-fadeIn border-none shadow-lg">
        <PageTitle className="mb-7 text-center">
          {CONTENT.auth.otp.title}
        </PageTitle>

        {/* Phone Display */}
        <InfoBadge
          label={CONTENT.auth.otp.subtitle}
          value={`+91 ${maskMobile(mobile)}`}
          action={() => navigate(ROUTES.LOGIN)}
          actionText={CONTENT.auth.otp.editNumber}
          actionIcon={Edit2}
        />

        {/* OTP Inputs */}
          <div className="mb-8">
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`otp-${index}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 h-14 text-center text-3xl font-bold p-0 ${
                    error
                      ? "border-red-400 text-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 text-green-600 focus:border-green-600 focus:ring-green-600"
                  }`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <div className="flex justify-center w-full">
              <FormError error={error} prefix={CONTENT.auth.login.errorPrefix} className="text-center justify-center mt-3" />
            </div>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isLoading || !otpFilled}
            variant={isLoading || !otpFilled ? "secondary" : "primary"}
            className="w-full py-4 rounded-xl text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {CONTENT.auth.otp.buttonLoadingText}
              </>
            ) : otpFilled ? (
              <>
                <Unlock className="w-5 h-5" />
                {CONTENT.auth.otp.buttonText}
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                {CONTENT.auth.otp.buttonText}
              </>
            )}
          </Button>

          {/* Resend OTP */}
          <div className="text-center mt-6">
            {resendTimer > 0 ? (
              <p className="text-gray-400 text-sm">
                {CONTENT.auth.otp.resendWait}{" "}
                <span className="font-bold text-green-600">{resendTimer}s</span>
              </p>
            ) : (
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={isLoading}
                className="text-green-600 hover:text-green-800"
              >
                {CONTENT.auth.otp.resendAction}
              </Button>
            )}
          </div>

          <div id="recaptcha-container" />
        </Card>
    </AuthLayout>
  );
};

export default OTPValidation;
