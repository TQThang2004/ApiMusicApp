const express = require("express")
const router = express.Router()

const MainController = require("../controllers/MainController")

router.post("/create-playlist", MainController.createPlaylist)
router.get("/get-playlist/:userId", MainController.getPlaylist)
router.post("/add-song-to-playlist", MainController.addSongToPlaylist)

module.exports = router