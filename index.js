const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Fake authentication endpoint
server.post('/login', (req, res) => {
  const { email, password } = req.body;

   // Get the list of users and owners from the database
   const users = router.db.get('users').value();
   const owners = router.db.get('owners').value();
   
   // Check if the login request is for a user or an owner
   const user = users.find(u => u.email === email && u.password === password);
   const owner = owners.find(o => o.email === email && o.password === password);
 
   if (user) {
    // User login logic
    const token = jwt.sign({ email: user.email, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else if (owner) {
    // Owner login logic
    const token = jwt.sign({ email: owner.email, role: 'owner' }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

server.use(router);
const PORT = process.env.PORT || 3000;
// const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
