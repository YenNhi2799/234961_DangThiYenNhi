import React, { useState, useEffect } from 'react';
import { getBooks, deleteBook } from './api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBooks = async (search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getBooks(search);
            setBooks(response.data);
        } catch (err) {
            setError('Lỗi khi tải dữ liệu sách');
            toast.error('Lỗi khi tải dữ liệu từ server!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks(searchTerm);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) {
            try {
                await deleteBook(id);
                toast.success('Xóa sách thành công!');
                fetchBooks();
            } catch (err) {
                toast.error('Lỗi khi xóa sách!');
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Tìm theo tên, tác giả, thể loại..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Tìm kiếm</button>
            </form>
            
            {/* <Link to="/add"><button>Thêm sách mới</button></Link> */}

            {isLoading && <p>Đang tải dữ liệu...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!isLoading && !error && (
                <table border="1" width="100%">
                    <thead>
                        <tr>
                            <th>Mã Sách</th>
                            <th>Tên Sách</th>
                            <th>Tác Giả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.bookId}>
                                <td>{book.bookId}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>
                                    {/* <Link to={`/detail/${book.bookId}`}>Xem</Link> | 
                                    <Link to={`/edit/${book.bookId}`}>Sửa</Link> |  */}
                                    <button onClick={() => handleDelete(book.bookId)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default BookList;
