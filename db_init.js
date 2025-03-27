const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();

// SQLite3 DB 연결
const db = new sqlite3.Database('./movies.db', (err) => {
  if (err) {
    console.error('DB 연결 실패:', err.message);
  } else {
    console.log('DB 연결 성공');
  }
});

// 엑셀 파일 읽기
const workbook = XLSX.readFile('movies.xlsx');
const sheetName = workbook.SheetNames[0]; // 첫 번째 시트 가져오기
const worksheet = workbook.Sheets[sheetName];

// 엑셀 데이터를 JSON으로 변환
const movies = XLSX.utils.sheet_to_json(worksheet);

// 테이블 생성 (이미 존재하면 넘어감)
db.run(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_title TEXT,
    overview TEXT,
    release_date TEXT,
    poster_path TEXT,
    backdrop_path TEXT,
    popularity REAL,
    vote_average REAL,
    vote_count INTEGER
  )
`, (err) => {
  if (err) {
    console.error('테이블 생성 실패:', err.message);
  } else {
    console.log('테이블 생성 완료');
  }
});

// 데이터 삽입
const insertData = db.prepare(`
  INSERT INTO movies (
    original_title, overview, release_date, poster_path, backdrop_path, popularity, vote_average, vote_count
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

movies.forEach((movie) => {
  insertData.run(
    movie['Original Title'],
    movie['Overview'],
    movie['Release Date'],
    movie['Poster Path'],
    movie['Backdrop Path'],
    movie['Popularity'],
    movie['Vote Average'],
    movie['Vote Count']
  );
});

// 삽입 완료 후 데이터베이스 종료
insertData.finalize(() => {
  console.log('모든 데이터 삽입 완료');
  db.close((err) => {
    if (err) {
      console.error('DB 종료 실패:', err.message);
    } else {
      console.log('DB 종료 완료');
    }
  });
});
