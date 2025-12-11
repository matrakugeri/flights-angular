const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { first } = require("rxjs");

const SECRET_KEY = "your-secret-key";
const expiresIn = "1h";

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Create JWT
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify JWT
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) =>
    decode !== undefined ? decode : err
  );
}

// Check if user exists
function getUser(email, password, db) {
  const user = db.get("users").find({ email }).value();
  if (user && bcrypt.compareSync(password, user.password)) return user;
  return null;
}

// Register endpoint
server.post("/auth/register", (req, res) => {
  const { email, password, role = "user", firstName, lastName } = req.body;
  console.log(req.body, "//////////////////////////");
  const db = router.db;

  if (db.get("users").find({ email }).value()) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now(),
    email,
    password: hashedPassword,
    role,
    firstName,
    lastName,
  };
  db.get("users").push(newUser).write();

  const token = createToken({ email, id: newUser.id });
  res.status(201).json({
    token,
    user: { id: newUser.id, email, role, firstName, lastName },
  });
});

// Login endpoint
server.post("/auth/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const db = router.db;

  const user = getUser(email, password, db);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken({ email, id: user.id, role: user.role });
  res.status(200).json({
    token,
    user: {
      id: user.id,
      email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

// Users
server.use((req, res, next) => {
  if (req.method === "GET" && req.path === "/users") {
    const { _start, _limit, _sort, _order, firstName, lastName } = req.query;
    let users = router.db.get("users").value();

    // Remove password field
    users = users.map(({ password, ...user }) => user);

    // Filtering
    users = users.filter((user) => {
      const matchFirstName = firstName
        ? user.firstName?.toLowerCase().includes(firstName.toLowerCase())
        : true;
      const matchLastName = lastName
        ? user.lastName?.toLowerCase().includes(lastName.toLowerCase())
        : true;

      return matchFirstName && matchLastName;
    });

    const totalResults = users.length;

    // Sorting
    if (_sort && _order) {
      users = users.sort((a, b) =>
        _order === "asc"
          ? a[_sort] > b[_sort]
            ? 1
            : -1
          : a[_sort] < b[_sort]
          ? 1
          : -1
      );
    }

    // Pagination
    if (_start && _limit) {
      users = users.slice(Number(_start), Number(_start) + Number(_limit));
    }

    res.setHeader("X-Total-Results", totalResults);
    return res.jsonp({ total: totalResults, data: users });
  }
  if (req.method === "PUT" && req.path === "/users/:id") {
    let users = router.db.get("users").value();
    const id = +req.params.id;
    const { email, firstName, lastName } = req.body;
    const user = users.find((el) => el.id === id);
  }

  next();
});

server.use((req, res, next) => {
  console.log(req, "REQ");
  if (req.method === "GET" && req.path === "/flights") {
    const {
      q,
      _start,
      _limit,
      _sort,
      _order,
      originFullName,
      destinationFullName,
      airline,
      flightNumber,
    } = req.query;

    let flights = router.db.get("flights").value();
    console.log(req.query, "QUERY");

    // Apply all filters
    flights = flights.filter((flight) => {
      const matchQuery = q
        ? flight.title.toLowerCase().includes(q.toLowerCase())
        : true;
      const matchOrigin = originFullName
        ? flight.originFullName
            ?.toLowerCase()
            .includes(originFullName.toLowerCase())
        : true;
      const matchDestination = destinationFullName
        ? flight.destinationFullName
            ?.toLowerCase()
            .includes(destinationFullName.toLowerCase())
        : true;
      const matchAirline = airline
        ? flight.airline?.toLowerCase().includes(airline.toLowerCase())
        : true;
      const matchFlightNumber = flightNumber
        ? flight.flightNumber
            ?.toLowerCase()
            .includes(flightNumber.toLowerCase())
        : true;

      return (
        matchQuery &&
        matchOrigin &&
        matchDestination &&
        matchAirline &&
        matchFlightNumber
      );
    });

    const totalResults = flights.length;
    console.log(totalResults, "totalResults");

    // Sorting
    if (_sort && _order) {
      flights = flights.sort((a, b) =>
        _order === "asc"
          ? a[_sort] > b[_sort]
            ? 1
            : -1
          : a[_sort] < b[_sort]
          ? 1
          : -1
      );
    }

    // Pagination
    if (_start && _limit) {
      flights = flights.slice(Number(_start), Number(_start) + Number(_limit));
    }

    res.setHeader("X-Total-Results", totalResults);
    return res.jsonp({ total: totalResults, data: flights });
  }

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

server.use((req, res, next) => {
  const db = router.db;

  if (req.method === "PATCH" && req.path.startsWith("/users/")) {
    const id = Number(req.path.split("/")[2]);

    const existingUser = db.get("users").find({ id }).value();
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const filteredBody = filterObj(req.body, "firstName", "lastName", "email");

    const updatedUser = db
      .get("users")
      .find({ id })
      .assign(filteredBody)
      .write();

    const { password, ...safeUser } = updatedUser;

    return res.json(safeUser);
  }

  next();
});

server.use(router);
server.listen(3333, () => {
  console.log("JSON Server is running at http://localhost:3333");
});
