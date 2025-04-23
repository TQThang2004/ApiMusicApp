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
    console.log(req.params)
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

const addSongToPlaylist = async (req, res) => {
    try {
        const result = await mainService.addSongToPlaylist(req.body);
        res.status(200).json({
            message: "Thêm bài hát vào playlist thành công",
            song: {
                id: result.id,
                name: result.name,
                userId: result.userId,
                thumbnail: result.thumbnail
            }
        });
    } catch (error) {
        
    }
}

module.exports = {
    createPlaylist,
    addSongToPlaylist,
    getPlaylist
}