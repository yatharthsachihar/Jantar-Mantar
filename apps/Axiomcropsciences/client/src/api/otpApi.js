import API from './axios';

// SwiftZap-backed OTP. In dev mode (no keys configured) the server returns
// `devOtp` so the flow is testable without real SMS.
export const otpApi = {
  send: ({ countryCode, mobile, purpose }) =>
    API.post('/otp/send', { countryCode, mobile, purpose }),
  verify: ({ countryCode, mobile, otp, purpose }) =>
    API.post('/otp/verify', { countryCode, mobile, otp, purpose }),
};
