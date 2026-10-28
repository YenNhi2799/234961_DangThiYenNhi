import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookList from './BookList'; // Bạn sẽ tạo file này
// import BookForm from './BookForm'; 
// import BookDetail from './BookDetail';

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Quản lý Sách</h1>
        <Routes>
          <Route path="/" element={<BookList />} />
          {/* <Route path="/add" element={<BookForm />} /> */}
          {/* <Route path="/edit/:id" element={<BookForm />} /> */}
          {/* <Route path="/detail/:id" element={<BookDetail />} /> */}
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}
export default App;