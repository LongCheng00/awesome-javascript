const jwt = require('jsonwebtoken');
const USERNAME = process.env.USERNAME || 'admin';
const PASSWORD = process.env.PASSWORD || 'password';
const APPSECRET = process.env.APPSECRET || 'secret';

const mappings = {
  get: ['api/orders', '/orders'],
  post: ['api/products', '/products', 'api/categories', '/categories'],
};
function requiresAuth(method, url) {
  return (mappings[method.toLowerCase()] || []).find((f) => url.startsWith(f)) !== undefined;
}
module.exports = function (req, res, next) {
  if (req.url.endsWith('/login') && req.method === 'POST') {
    if (req.body.username === USERNAME && req.body.password === PASSWORD) {
      const token = jwt.sign({ username: USERNAME, expriesIn: '1h' }, APPSECRET);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
    res.end();
    return;
  } else if (requiresAuth(req.method, req.url)) {
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
      token = token.substring(7, token.length - 1);
      try {
        const decoded = jwt.verify(token, APPSECRET);
        req.user = decoded;
        next();
        return;
      } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
      }
    }
    res.status(401).json({ error: 'Missing or invalid token' });
    res.end();
    return;
  } else {
    next();
  }
};
