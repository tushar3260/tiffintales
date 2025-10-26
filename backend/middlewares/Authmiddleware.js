import jwt from 'jsonwebtoken';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // ✅ 1. Get token from Authorization header or cookies
      const tokenFromHeader = req.headers.authorization?.split(" ")[1];
      const tokenFromCookie = req.cookies?.token;
      const token = tokenFromHeader || tokenFromCookie;

      if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
      }

      // ✅ 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;  // { id: ..., role: ... }

      // ✅ 3. Check role (if roles are provided)
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: `Access Denied: Requires role(s): ${allowedRoles.join(', ')}` });
      }

      next();
    } catch (error) {
      console.error("Authorization Error:", error.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export default authorize;
