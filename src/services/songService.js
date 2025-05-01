const { Timestamp } = require("firebase-admin/firestore");
const db = require("../config/db");



const addSongToFavorite = async ({ userId, songId, title, thumbnailM ,genreIds,artist}) => {
  console.log("addSongToFavorite------------------", userId, songId, title, thumbnailM,genreIds,artist);
    if (!userId || !songId) throw new Error("Thiếu userId hoặc songId");
  
    const songRef = db.ref(`users/${userId}/favorite/song/${songId}`);
    const snapshot = await songRef.once("value");
  
    if (snapshot.exists()) {
      throw new Error("Bài hát đã có trong danh sách yêu thích");
    }
  
    await songRef.set({
      encodeId: songId,
      title:title,
      thumbnailM,
      genreIds,
      artist,
    });
  
    return { id: songId, title, thumbnailM,genreIds };
  };
  
  const removeSongFromFavorite = async ({ userId, songId }) => {
    if (!userId || !songId) throw new Error("Thiếu userId hoặc songId");
  
    const songRef = db.ref(`users/${userId}/favorite/song/${songId}`);
    const snapshot = await songRef.once("value");
  
    if (!snapshot.exists()) {
      throw new Error("Bài hát không tồn tại trong danh sách yêu thích");
    }
  
    await songRef.remove();
  };

  const getFavoritePlaylist = async (userId) => {
    if (!userId) throw new Error("Thiếu userId");
  
    const ref = db.ref(`users/${userId}/favorite/song`);
    const snapshot = await ref.once("value");
  
    if (!snapshot.exists()) return [];
  
    return Object.values(snapshot.val());
  };
  
  const isFavorite = async ({ userId, songId }) => {
    if (!userId || !songId) throw new Error("Thiếu userId hoặc songId");

    const songRef = db.ref(`users/${userId}/favorite/song/${songId}`);

    try {
        const snapshot = await songRef.once("value");
        if (snapshot.exists()) {
            console.log("Bài hát đã có trong danh sách yêu thích.");
            return true;
        } else {
            console.log("Bài hát chưa có trong danh sách yêu thích.");
            return false;
        }
    } catch (error) {
        console.error("Lỗi truy vấn Firebase:", error);
        throw new Error("Không thể truy vấn Firebase");
    }
};

const addSongToHistory = async ({ userId, songId, title, thumbnailM, genreIds,artist }) => {
  if (!userId || !songId) throw new Error("Thiếu userId hoặc songId");
  console.log("Hello",artist)


  const historyRef = db.ref(`users/${userId}/history/${songId}`);
  const snapshot = await historyRef.once("value");

  const listenedAt = new Date().toString();

  if (snapshot.exists()) {
    // Nếu đã có bài hát thì chỉ update thời gian nghe
    await historyRef.update({
      listenedAt,
    });
  } else {
    // Nếu chưa có thì tạo mới
    await historyRef.set({
      encodeId: songId,
      title:title,
      thumbnailM,
      listenedAt,
      genreIds,
      artist,
    });
  }
};



module.exports = {
    addSongToFavorite,
    getFavoritePlaylist,
    isFavorite, 
    removeSongFromFavorite,
    addSongToHistory
};
