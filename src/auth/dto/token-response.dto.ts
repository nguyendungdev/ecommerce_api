export default class TokenResponseDto {
  jwtAccessToken: string;
  refreshToken: string;
  tokenExpires: number;
  sessionId?: string;
}
