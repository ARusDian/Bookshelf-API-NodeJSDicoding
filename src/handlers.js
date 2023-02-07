const {
  nanoid,
} = require('nanoid');

const books = require('./books');

// Handler Menambahkan Buku
const addBookHandler = (request, h) => {
  // parameter request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  // random id value
  const id = nanoid(16);

  // Mengecek Nama buku Apakah Tersedia atau tidak
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // Mengecek apakah jumlah halaman yang dibaca
  // apakah lebih kecil atau kurang dari jumlah halaman
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. '+
      'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // buku yang selesai dibaca
  const finished = readPage == pageCount;

  // Menyimpan waktu data dibuat
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  // menyimpan data buku
  books.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  });
  // Mengecek apakah data buku tersimpan di collection books
  const isSuccess = books.filter(
      (book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  // Jika tidak tersimpan maka akan mengembalikan response error
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Handler mengambil semua data buku sesuai parameter yang diberikan
const getAllBooksHandler = (request, h) => {
  // Mengambil parameter request yang diberikan
  const {
    name,
    reading,
    finished,
  } = request.query;
  // Mengecek apakah parameter request name ada nilainya
  if (name) {
    // mengfilter buku berdasarkan nama buku yang dihuruf kecilkan
    // dengan parameter nama yang dihuruf kecilkan
    const filteredBooks = books.filter(
        (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
    // Mengecek apakah parameter request reading ada nilainya
  } else if (reading) {
    // mengfilter buku berdasarkan property reading buku
    // yang ditypecasting ke int dengan parameter reading
    const filteredBooks = books.filter(
        (book) => Number(book.reading) === Number(reading),
    );
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
    // Mengecek apakah parameter request finished ada nilainya
  } else if (finished) {
    // mengfilter buku berdasarkan property finished buku
    // yang ditypecasting ke int dengan parameter finished
    const filteredBooks = books.filter(
        (book) => Number(book.finished) === Number(finished),
    );
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
    //  Jika tidak ada parameter request yang diberikan
    // maka akan mengembalikan semua data buku
  } else {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  };
};

const getBookByIdHandler = (request, h) => {
  const {
    id,
  } = request.params;
  const book = books.filter((data) => data.id === id)[0];
  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  // Mengambil Parameter request id
  const {
    id,
  } = request.params;

  // Mengambil data dari request body
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  // jika name buku tidak ada nilainya maka akan mengembalikan error
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  //  Mengecek apakah jumlah halaman yang dibaca
  // apakah lebih kecil atau kurang dari jumlah halaman
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. '+
      'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {
    id,
  } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
