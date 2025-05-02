const db = require("../config/db");
const moment = require("moment");

// Tham số cấu hình
const WEIGHT_FAVORITE = 4;
const WEIGHT_HISTORY = 1; 
const TIME_DECAY_HALF_LIFE = 7;

// Tạo vector thể loại cho một bài hát
function vectorizeGenres(genreIds) {
  const vec = {};
  (genreIds || []).forEach(g => { vec[g] = 1; });
  return vec;
}

// Tính cosine similarity giữa hai vectors
function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (const k in a) {
    dot += (a[k] || 0) * (b[k] || 0);
    magA += (a[k] ** 2);
  }
  for (const k in b) magB += (b[k] ** 2);
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Tính weight giảm dần theo thời gian (time decay)
function timeDecayWeight(timestamp) {
  const daysAgo = moment().diff(moment(timestamp), 'days');
  return Math.pow(0.5, daysAgo / TIME_DECAY_HALF_LIFE);
}

function buildUserProfile(songs) {
  const profile = {};
  songs.forEach(item => {
    const weight = (item.isFavorite ? WEIGHT_FAVORITE : WEIGHT_HISTORY) * timeDecayWeight(item.timestamp);
    (item.genreIds || []).forEach(g => {
      profile[g] = (profile[g] || 0) + weight;
    });
  });
  return profile;
}

async function fetchAllUsers(batchSize = 100) {
  const ref = db.ref("users");
  const snap = await ref.once("value");
  if (!snap.exists()) return {};
  return snap.val();
}

// Hàm gợi ý mới
async function getRecommendationsV2(userId, limit = 10) {
  if (!userId) throw new Error("Thiếu userId");

  // 1. Lấy tất cả dữ liệu
  const allUsers = await fetchAllUsers();
  const me = allUsers[userId];
  if (!me) throw new Error("Không tìm thấy user");

  // 2. Chuẩn bị dữ liệu input
  const myFav = Object.values(me.favorite?.song || {}).map(s => ({ ...s, isFavorite: true }));
  const myHis = Object.values(me.history || {}).map(s => ({ ...s, isFavorite: false }));

  
  const mySongs = [...myFav, ...myHis];
  const listenedIds = new Set(mySongs.map(s => s.id || s.encodeId));

  // 3. Xây dựng profile thể loại của tôi
  const myProfile = buildUserProfile(mySongs);

  // 4. Thu thập ứng viên (không duplicate)
  const candidates = [];
  const seen = new Set();
  for (const [uid, data] of Object.entries(allUsers)) {
    if (uid === userId) continue;
    const list = [
      ...Object.values(data.favorite?.song || {}).map(s => ({ ...s, isFavorite: true })),
      ...Object.values(data.history || {}).map(s => ({ ...s, isFavorite: false }))
    ];
    for (const s of list) {
      const sid = s.id || s.encodeId;
      if (!listenedIds.has(sid) && !seen.has(sid)) {
        candidates.push(s);
        seen.add(sid);
      }
    }
  }
  if (candidates.length === 0) return [];

  // 5. Score dựa trên cosine similarity
  const scored = candidates.map(song => {
    const songVec = vectorizeGenres(song.genreIds);
    const score = cosineSimilarity(myProfile, songVec);
    return { ...song, score };
  });

  // 6. Sắp xếp và trả kết quả
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

module.exports = { getRecommendationsV2 };
