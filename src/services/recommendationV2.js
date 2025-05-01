const db = require("../config/db");
const moment = require("moment");
const { ZingMp3 } = require("zingmp3-api-full");

const WEIGHT_FAVORITE = 4;
const WEIGHT_HISTORY = 1;
const TIME_DECAY_HALF_LIFE = 7;

const TOP_NHAC_HAN_PLAYLIST_ID = "ZWZB96DC";
const TOP_RAP_VIET_PLAYLIST_ID = "ZWZB96AI";

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

// Xây dựng profile người dùng: vector thể loại có trọng số
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

// Lấy tất cả người dùng
async function fetchAllUsers() {
  const ref = db.ref("users");
  const snap = await ref.once("value");
  return snap.exists() ? snap.val() : {};
}

// Hàm gợi ý mới kết hợp top lists từ Firebase và Zing API
async function getRecommendationsV2(userId, limit = 0) {
  if (!userId) throw new Error("Thiếu userId");

  // 1. Lấy dữ liệu user từ Firebase
  const allUsers = await fetchAllUsers();
  const me = allUsers[userId];
  if (!me) throw new Error("Không tìm thấy user");

  // 2. Chuẩn bị dữ liệu input: favorite & history
  const myFav = Object.values(me.favorite?.song || {}).map(s => ({ ...s, isFavorite: true }));
  const myHis = Object.values(me.history || {}).map(s => ({ ...s, isFavorite: false }));

  // 3. Lấy Top 100 Nhạc trẻ & Rap Việt từ Zing API
  const [plKorea, plRap] = await Promise.all([
    ZingMp3.getDetailPlaylist(TOP_NHAC_HAN_PLAYLIST_ID),
    ZingMp3.getDetailPlaylist(TOP_RAP_VIET_PLAYLIST_ID)
  ]);

  console.log("+++++++++++++++++++plKorea",plKorea.data,"plRap",plRap)
  const topNhacHan = (plKorea.data.song.items  || []).map(s => ({ ...s, isFavorite: false, fromTop: 'nhachan' }));
  const topRapViet = (plRap.data.song.items   || []).map(s => ({ ...s, isFavorite: false, fromTop: 'rapviet' }));

  // 4. Kết hợp và loại trùng
  const allInputs = [...myFav, ...myHis, ...topNhacHan, ...topRapViet];
  const listenedIds = new Set(allInputs.map(s => s.id || s.encodeId));

  // 5. Xây dựng profile thể loại
  const myProfile = buildUserProfile(allInputs);

  // 6. Thu thập candidate songs từ các user khác
  const candidates = [];
  const seen = new Set();
  Object.entries(allUsers).forEach(([uid, data]) => {
    if (uid === userId) return;
    const list = [
      ...Object.values(data.favorite?.song || {}).map(s => ({ ...s, isFavorite: true })),
      ...Object.values(data.history || {}).map(s => ({ ...s, isFavorite: false }))
    ];
    list.forEach(s => {
      const sid = s.id || s.encodeId;
      if (!listenedIds.has(sid) && !seen.has(sid)) {
        candidates.push(s);
        seen.add(sid);
      }
    });
  });
  if (!candidates.length) return [];

  // 7. Score và sort
  const scored = candidates.map(song => ({
    ...song,
    score: cosineSimilarity(myProfile, vectorizeGenres(song.genreIds))
  }));
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

module.exports = { getRecommendationsV2 };
