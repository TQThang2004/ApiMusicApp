const express = require("express");
const router = express.Router();

const SongController = require("../controllers/SongController");
const RecommendationController = require("../controllers/RecommendationController");

router.post("/favorite/add", SongController.addSongToFavorite);
router.post("/favorite/remove", SongController.removeSongFromFavorite);
router.get("/favorite/getAll", SongController.getFavoritePlaylist);
router.get("/favorite/isFavorite", SongController.checkIsFavorite);
router.post('/history', SongController.addSongToHistory);
router.get('/recommendations', RecommendationController.getRecommendations);

module.exports = router;
