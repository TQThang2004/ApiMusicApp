const express = require("express")
const router = express.Router()

const MainController = require("../controllers/MainController")

router.post("/create-playlist", MainController.createPlaylist)
router.get("/get-playlist/:userId", MainController.getPlaylist)
router.delete("/remove-playlist", MainController.removePlaylist)
router.post("/add-song-to-playlist", MainController.addSongToPlaylist)
router.get("/get-songs-from-playlist/:userId/:playlistId", MainController.getSongsFromPlaylist)
router.delete("/remove-song-from-playlist", MainController.removeSongFromPlaylist)

module.exports = router