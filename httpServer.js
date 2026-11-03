import http from "http";
import fs from "fs";

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350 },
];

const server = http.createServer((req, res) => {
  const sendJSON = (status, data) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Library Management</h1>");
  } else if (req.method === "GET" && req.url === "/books") {
    sendJSON(200, books);
  } else if (req.method === "GET" && req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h2>Library Book Management Application</h2>");
  } else if (req.method === "GET" && req.url === "/home") {
    fs.readFile("./public/index.html", (err, data) => {
      if (err) {
        sendJSON(500, { message: "File not found" });
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.method === "POST" && req.url === "/add-book") {
    let body = "";

    req.on("data", (chunk) => (body += chunk));

    req.on("end", () => {
      try {
        const book = JSON.parse(body);

        if (
          book.id == null ||
          !book.title ||
          !book.author ||
          typeof book.price !== "number" ||
          !Number.isFinite(book.price)
        ) {
          return sendJSON(400, { message: "Invalid book details" });
        }

        if (books.some((b) => b.id === book.id)) {
          return sendJSON(400, { message: "Book ID already exists" });
        }

        books.push(book);
        sendJSON(201, { message: "Book added successfully", book });
      } catch {
        sendJSON(400, { message: "Invalid JSON" });
      }
    });
  } else {
    sendJSON(404, { message: "Route not found" });
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});