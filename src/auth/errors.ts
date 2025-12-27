export class AuthError extends Error {
  readonly code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}