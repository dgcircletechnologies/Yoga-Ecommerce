export type LoginCredentials = {
  email: string;
  password: string;
};

/**
 * Authentication integration boundary. Replace this with the backend login
 * request once the authentication endpoint is available.
 */
export async function login(_credentials: LoginCredentials): Promise<void> {
  void _credentials;
  await new Promise((resolve) => window.setTimeout(resolve, 400));
  throw new Error("Online login is not available yet. Please contact the administrator.");
}
