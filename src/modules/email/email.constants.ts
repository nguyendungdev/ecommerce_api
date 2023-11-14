export enum EmailMessage {}

export enum EmailSummary {
  RESEND_CONFIRMATION_LINK = 'Resend email confirmation link',
  CONFIRM_EMAIL = 'Confirm email using token',
}

export enum EmailDescription {
  CONFIRM_EMAIL_SUCCESS = 'Email confirmed successfully',
  RESEND_CONFIRMATION_LINK_SUCCESS = 'Email confirmation link resent successfully',
}
