export enum AuthMessage {
  SIGN_IN_SUCCESS = 'Sign in success.',
  SIGN_UP_SUCCESS = 'Sign up success.',
  INVALID_CREDENTIALS = 'Invalid credentials.',
}

export enum AuthDescription {
  SIGN_IN_SUCCESS = 'Sign in success.',
  SIGN_UP_SUCCESS = 'Sign up success.',
  EMAIL_EXIST = 'Cannot process if already sign up with email.',
  INVALID_CREDENTIALS = 'Invalid credentials.',
  RESET_PASSWORD_SUCCESS = 'Reset Password succcess.',
  FORGOT_PASWORD = 'Redirects to the password reset  succcess.',
  REFRESH_TOKEN_SUCCESS = 'Refresh JWT access token success.',
  LOG_OUT_SUCCESS = 'Log out success.',
}

export enum AuthSummary {
  SIGN_UP_SUMMARY = 'Sign up for users.',
  SIGN_IN_SUMMARY = 'Sign in for users.',
  RESET_PASSWORD_SUMMARY = 'Reset password for users',
  FORGOT_PASWORD_SUMMARY = 'Forgot password for users',
  REFRESH_TOKEN_SUMMARY = 'Refresh JWT Token.',
  LOG_OUT_SUMMARY = 'Log out for users.',
}
