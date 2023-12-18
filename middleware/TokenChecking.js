/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
export async function verifyLongLivedToken(token, type) {
  return new Promise((resolve, reject) => {
    try {
      const secret =
        type == 'citizen'
          ? 'er@rdcd@t0ken'
          : type == 'user'
            ? 'ddfbd8b77445ebb9dd0cdf0fb3940ec1a7f06632649aba8ed01e96dc15e9563b'
            : '';
      jwt.verify(token, secret, (err, payload) => {
        if (err) reject(err);
        resolve(payload);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

export async function getLongLivedToken(body, expireTime) {
  return new Promise((resolve, reject) => {
    try {
      const secret = getJWTSecret(jwtType);
      jwt.sign(body, secret, { expiresIn: expireTime }, (err, token) => {
        if (err) reject(err);
        if (token) resolve(token);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}
