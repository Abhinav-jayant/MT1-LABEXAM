
import express from "express";

const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 450, category: "Self Help" },
  { id: 3, title: "Clean Code", author: "Robert Martin", price: 550, category: "Programming" }
];

function validBook(book) {
  return book &&
    Number.isInteger(book.id) &&
    typeof book.title === "string" && book.title.trim() &&
    typeof book.author === "string" && book.author.trim() &&
    typeof book.price === "number" && Number.isFinite(book.price) &&
    typeof book.category === "string" && book.category.trim();
}

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

app.post("/books", (req, res) => {
  const book = req.body;
  if (!validBook(book)) {
    return res.status(400).json({ message: "Invalid book details" });
  }
  if (books.some(b => b.id === book.id)) {
    return res.status(400).json({ message: "Book ID already exists" });
  }
  books.push(book);
  res.status(201).json({ message: "Book added successfully", book });
});

app.put("/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const updated = { ...books[index], ...req.body, id: books[index].id };

  if (!validBook(updated)) {
    return res.status(400).json({ message: "Invalid book details" });
  }

  books[index] = updated;
  res.json({ message: "Book updated successfully", book: updated });
});

app.delete("/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  books.splice(index, 1);
  res.json({ message: "Book deleted successfully" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(400).json({ message: "Invalid JSON request" });
});

app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});
