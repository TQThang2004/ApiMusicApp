const db = require("../config/db");

// Đếm thể loại yêu thích từ danh sách bài hát
const countGenres = (songs) => {
  const genreCount = {};
  songs.forEach(song => {
    if (Array.isArray(song.genreIds)) {
      song.genreIds.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    }
  });
  return genreCount;
};

// Tính điểm bài hát theo genre người dùng yêu thích
const scoreSongs = (songs, genreCount) => {
  return songs.map(song => {
    const score = (song.genreIds || []).reduce((total, g) => total + (genreCount[g] || 0), 0);
    return { ...song, score };
  }).sort((a, b) => b.score - a.score);
};

const getRecommendations = async (userId, limit = 10) => {
  if (!userId) throw new Error("Thiếu userId");

  console.log("getRecommendations allUsersData")

  const userRef = db.ref("users");
  const allUsersSnap = await userRef.once("value");

  console.log("allUsersSnap.exists():", allUsersSnap.exists());
  console.log("allUsersSnap.val():", allUsersSnap.val());


  if (!allUsersSnap.exists()) {
    console.warn("Không tìm thấy dữ liệu người dùng trong Firebase");
    return [];
  }
  

  const allUsersData = allUsersSnap.val();
  console.log("getRecommendations allUsersData",allUsersData)

  // 1. Lấy dữ liệu user hiện tại
  const currentUserData = allUsersData[userId];
  if (!currentUserData) throw new Error("Không tìm thấy user");

  const currentFavorite = currentUserData.favorite?.song ? Object.values(currentUserData.favorite.song) : [];
  const currentHistory = currentUserData.history ? Object.values(currentUserData.history) : [];
  const currentSongs = [...currentFavorite, ...currentHistory];

  // Lưu các ID đã nghe hoặc đã yêu thích để không đề xuất lại
  const listenedIds = new Set(currentSongs.map(song => song.id || song.encodeId));

  // 2. Tính genre người dùng yêu thích
  const userGenreCount = countGenres(currentSongs);

  // 3. Duyệt tất cả user khác để thu thập bài hát ứng viên
  const candidateSongs = [];

  Object.entries(allUsersData).forEach(([uid, data]) => {
    if (uid === userId) return;

    const fav = data.favorite?.song ? Object.values(data.favorite.song) : [];
    const his = data.history ? Object.values(data.history) : [];

    [...fav, ...his].forEach(song => {
      const songId = song.id || song.encodeId;
      if (!listenedIds.has(songId)) {
        candidateSongs.push(song);
        listenedIds.add(songId);
      }
    });
  });

  if (candidateSongs.length === 0) return [];

  // 4. Tính điểm và gợi ý bài hát
  const scored = scoreSongs(candidateSongs, userGenreCount);

  return scored.slice(0, limit);
};

module.exports = {
  getRecommendations,
};
