const mainService = require('../services/mainService');

const createPlaylist = async (req, res) => {
    try {
        const result = await mainService.createPlaylist(req.body);
        res.status(200).json({
            message: "Tạo playlist thành công",
            playlist: {
                id: result.id,
                name: result.name,
                userId: result.userId,
                thumbnail: result.thumbnail
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error.message)
    }
}

const getPlaylist = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await mainService.getPlaylist(userId);
        res.status(200).json({
            message: "Lấy playlist thành công",
            playlist: {
                result
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error.message)
    }
}

const getSongsFromPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const result = await mainService.getSongsFromPlaylist(playlistId);
        res.status(200).json({
            message: "Lấy bài hát thành công",
            songs: {
                result
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error.message)
    }
}

const addSongToPlaylist = async (req, res) => {
    try {
        const result = await mainService.addSongToPlaylist(req.body);
        res.status(200).json({
            message: "Thêm bài hát vào playlist thành công",
            data: {
                result
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error.message)
    }
}

const removeSongFromPlaylist = async (req, res) => {
    try {
        const result = await mainService.removeSongFromPlaylist(req.body);
        res.status(200).json({
            message: "Xoá playlist thành công",
            data: {
                result
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log(error.message)
    }
}

module.exports = {
    createPlaylist,
    addSongToPlaylist,
    getPlaylist,
    getSongsFromPlaylist,
    removeSongFromPlaylist
}