require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./models/Book');

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Kết nối MongoDB thành công'))
    .catch(err => console.error('Lỗi kết nối CSDL:', err));

// GET /health: Kiểm tra trạng thái hoạt động của backend
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running normally' });
});

// GET /api/books: Lấy danh sách hoặc tìm kiếm theo từ khóa
app.get('/api/books', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        // Hỗ trợ tìm kiếm theo tên sách, tác giả hoặc thể loại
        if (search) {
            const regex = new RegExp(search, 'i');
            query = { $or: [{ title: regex }, { author: regex }, { category: regex }] };
        }
        const books = await Book.find(query);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});

// GET /api/books/:id: Xem thông tin một sách theo bookId
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: req.params.id });
        // Xử lý trường hợp không tìm thấy sách
        if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
});

// POST /api/books: Thêm sách mới
app.post('/api/books', async (req, res) => {
    try {
        const { bookId, title, author, category } = req.body;
        // Kiểm tra dữ liệu đầu vào
        if (!bookId || !title || !author || !category) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
        // Không cho phép trùng mã sách bookId
        const existingBook = await Book.findOne({ bookId });
        if (existingBook) {
            return res.status(400).json({ message: 'Mã sách bookId đã tồn tại' });
        }
        
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sách', error });
    }
});

// PUT /api/books/:id: Cập nhật thông tin sách
app.put('/api/books/:id', async (req, res) => {
    try {
        if (req.body.bookId) {
            return res.status(400).json({ message: 'Không được phép sửa mã sách bookId' });
        }
        const updatedBook = await Book.findOneAndUpdate(
            { bookId: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedBook) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật', error });
    }
});

// DELETE /api/books/:id: Xóa sách
app.delete('/api/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findOneAndDelete({ bookId: req.params.id });
        if (!deletedBook) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.status(200).json({ message: 'Xóa sách thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa', error });
    }
});

// Sử dụng biến môi trường để cấu hình cổng chạy
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});