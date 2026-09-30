export const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJwt(token);

  if (!decoded?.exp) return true;

  const now = Date.now() / 1000; // seconds
  return decoded.exp < now;
};
