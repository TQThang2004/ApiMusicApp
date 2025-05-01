const mainService = require('../services/mainService');

const createPlaylist = async (req, res) => {
    console.log(req.body)
    try {
        const result = await mainService.createPlaylist(req.body);
        res.status(200).json({
            message: "Tạo playlist thành công",
            playlist: {
                id: result.id,
                name: result.name,
                thumbnailM: result.thumbnailM
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

const removePlaylist = async (req, res) => {
    try {
        const result = await mainService.removePlaylist(req.body);
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

const getSongsFromPlaylist = async (req, res) => {
    try {
        const { userId, playlistId } = req.params;
        
        const songs = await mainService.getSongsFromPlaylist({ userId, playlistId });
        
        res.status(200).json({
            success: true,
            message: "Lấy danh sách bài hát thành công",
            data: {
                playlistId,
                songs
            }
        });
    } catch (error) {
        console.log("Error in getSongsFromPlaylist:", error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const addSongToPlaylist = async (req, res) => {
    try {
        const result = await mainService.addSongToPlaylist(req.body);
        res.status(200).json({
            success: true,
            message: "Thêm bài hát vào playlist thành công",
            song: {
                id: result.id,
                name: result.name,
                thumbnailM: result.thumbnailM
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
            success: true,
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
    removeSongFromPlaylist,
    removePlaylist
}