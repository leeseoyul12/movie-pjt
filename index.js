const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const PORT = 3000;

// SQLite3 DB 연결
const db = new sqlite3.Database('./movies.db', (err) => {
  if (err) {
    console.error('DB 연결 실패:', err.message);
  } else {
    console.log('DB 연결 성공');
  }
});

app.use(cors()); // CORS 설정

// 영화 목록 조회 API
app.get('/movies', (req, res) => {
  const query = 'SELECT id, original_title, poster_path, vote_average FROM movies';

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('DB 조회 에러:', err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

// 특정 영화의 상세 정보 조회 API
app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const query = 'SELECT * FROM movies WHERE id = ?';

  db.get(query, [movieId], (err, row) => {
    if (err) {
      console.error('DB 조회 에러:', err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (row) {
      res.json(row); // 영화 상세 정보 반환
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
