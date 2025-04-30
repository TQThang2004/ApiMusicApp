const express = require("express");
const router = express.Router();

const SongController = require("../controllers/SongController");

router.post("/favorite/add", SongController.addSongToFavorite);
router.post("/favorite/remove", SongController.removeSongFromFavorite);
router.get("/favorite/getAll", SongController.getFavoritePlaylist);
router.get("/favorite/isFavorite", SongController.checkIsFavorite);
router.post('/history', SongController.addSongToHistory);

module.exports = router;
