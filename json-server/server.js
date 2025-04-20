const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
  const { email, password, role = "user" } = req.body;
  console.log(req.body, "//////////////////////////");
  const db = router.db;

  if (db.get("users").find({ email }).value()) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: Date.now(), email, password: hashedPassword, role };
  db.get("users").push(newUser).write();

  const token = createToken({ email, id: newUser.id });
  res.status(201).json({ token, user: { id: newUser.id, email, role } });
});

// Login endpoint
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = router.db;

  const user = getUser(email, password, db);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken({ email, id: user.id, role: user.role });
  res
    .status(200)
    .json({ token, user: { id: user.id, email, role: user.role } });
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

server.use(router);
server.listen(3333, () => {
  console.log("JSON Server is running at http://localhost:3333");
});

// Protect other routes (optional)
// server.use(/^(?!\/auth).*$/, (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Missing token" });
//   }
//   try {
//     verifyToken(authHeader.split(" ")[1]);
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// });

// Flight search logic (keep your existing)
// server.use((req, res, next) => {
//   if (req.method === "GET" && req.query.q) {
//     const {
//       q,
//       _start,
//       _limit,
//       _sort,
//       _order,
//       originFullName,
//       destinationFullName,
//       airline,
//       flightNumber,
//     } = req.query;
//     let flights = router.db.get("flights").value();
//     console.log(req.query, "QUERY");

//     if (q) {
//     }
//     const filteredFlights = flights.filter((flight) =>
//       flight.title.toLowerCase().includes(q.toLowerCase())
//     );

//     // Filtering logic
//     if (originFullName) {
//       flights = flights.filter((flight) =>
//         flight.originFullName
//           .toLowerCase()
//           .includes(originFullName.toLowerCase())
//       );
//     }

//     if (destinationFullName) {
//       flights = flights.filter((flight) =>
//         flight.destinationFullName
//           .toLowerCase()
//           .includes(destinationFullName.toLowerCase())
//       );
//     }

//     console.log(airline, "AIRLINE");
//     if (airline) {
//       flights = flights.filter((flight) =>
//         flight.airline.toLowerCase().includes(airline.toLowerCase())
//       );
//     }

//     if (flightNumber) {
//       flights = flights.filter((flight) =>
//         flight.flightNumber.toLowerCase().includes(flightNumber.toLowerCase())
//       );
//     }

//     const totalResults = filteredFlights.length;
//     console.log(totalResults, "totalResults");

//     if (_sort && _order) {
//       flights = filteredFlights.sort((a, b) =>
//         _order === "asc"
//           ? a[_sort] > b[_sort]
//             ? 1
//             : -1
//           : a[_sort] < b[_sort]
//           ? 1
//           : -1
//       );
//     } else {
//       flights = filteredFlights;
//     }

//     if (_start && _limit) {
//       flights = flights.slice(Number(_start), Number(_start) + Number(_limit));
//     }

//     res.setHeader("X-Total-Results", totalResults);
//     return res.jsonp(flights);
//   }

//   next();
// });

// const jsonServer = require("json-server");
// const server = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();
// server.use((req, res, next) => {
//   res.header("Access-Control-Expose-Headers", "X-Total-Results, Authorization");
//   next();
// });
// // Use default middlewares (logger, static, cors, no-cache)
// server.use(middlewares);

// // Custom route for handling q and additional query parameters
// server.use(jsonServer.bodyParser);

// server.use((req, res, next) => {
//   if (req.method === "GET" && req.query.q) {
//     const { q, _start, _limit, _sort, _order } = req.query;

//     // Fetch all flights
//     let flights = router.db.get("flights").value();

//     // Filter flights by q (search in title)
//     const filteredFlights = flights.filter((flight) =>
//       flight.title.toLowerCase().includes(q.toLowerCase())
//     );

//     // Save the total number of filtered results
//     const totalResults = filteredFlights.length;
//     console.log(totalResults, "totalResults");

//     // Sort flights if _sort and _order are provided
//     if (_sort && _order) {
//       flights = filteredFlights.sort((a, b) => {
//         if (_order === "asc") return a[_sort] > b[_sort] ? 1 : -1;
//         return a[_sort] < b[_sort] ? 1 : -1;
//       });
//     } else {
//       flights = filteredFlights; // Default to filtered flights if no sorting
//     }

//     // Paginate results if _start and _limit are provided
//     if (_start && _limit) {
//       flights = flights.slice(Number(_start), Number(_start) + Number(_limit));
//     }

//     // Set the total results count in headers
//     res.setHeader("X-Total-Results", totalResults);

//     // Return filtered and paginated flights

//     return res.jsonp(flights);
//   }

//   // Default handler for other routes
//   next();
// });

// // Use the default router for other requests
// server.use(router);

// // Start the server
// server.listen(3333, () => {
//   console.log("JSON Server is running at http://localhost:3333");
// });

// const jsonServer = require("json-server");
// const server = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();

// // Use default middlewares (logger, static, cors, no-cache)
// server.use(middlewares);

// // Custom route for handling q and additional query parameters
// server.use(jsonServer.bodyParser);

// server.use((req, res, next) => {
//   if (req.method === "GET" && req.query.q) {
//     const { q, _start, _limit, _sort, _order } = req.query;

//     // Fetch all flights
//     let flights = router.db.get("flights").value();

//     // Filter flights by q (search in title)
//     flights = flights.filter((flight) =>
//       flight.title.toLowerCase().includes(q.toLowerCase())
//     );

//     // Sort flights if _sort and _order are provided
//     if (_sort && _order) {
//       flights = flights.sort((a, b) => {
//         if (_order === "asc") return a[_sort] > b[_sort] ? 1 : -1;
//         return a[_sort] < b[_sort] ? 1 : -1;
//       });
//     }

//     // Paginate results if _start and _limit are provided
//     if (_start && _limit) {
//       flights = flights.slice(Number(_start), Number(_start) + Number(_limit));
//     }

//     // Return filtered and paginated flights
//     return res.jsonp(flights);
//   }

//   // Default handler for other routes
//   next();
// });

// // Use the default router for other requests
// server.use(router);

// // Start the server
// server.listen(3333, () => {
//   console.log("JSON Server is running at http://localhost:3333");
// });
