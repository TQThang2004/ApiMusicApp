const songService = require('../services/songService');



const addSongToFavorite = async (req, res) => {
  console.log("1------------"); 
    try {
      const { userId, songId, title, thumbnailM, genreIds,artist } = req.body;
      console.log("2--------------"); 
      console.log(userId, songId, title, thumbnailM, genreIds);
      const result = await songService.addSongToFavorite({ userId, songId, title, thumbnailM ,genreIds,artist});
      res.status(200).json({
        message: '✅ Đã thêm vào danh sách yêu thích',
        song: result,
      });
    } catch (error) {
      console.log("1erore---------------------"); 
      res.status(400).json({ message: error.message });
    }
  };
  
  const removeSongFromFavorite = async (req, res) => {
    try {
      const { userId, songId } = req.body;
      await songService.removeSongFromFavorite({ userId, songId });
      res.status(200).json({ message: '🗑️ Đã xóa khỏi danh sách yêu thích' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const getFavoritePlaylist = async (req, res) => {
    try {
      console.log("------------getFavoritePlaylist--------------------\n")
      const { userId } = req.query;
      const result = await songService.getFavoritePlaylist(userId);
      console.log(result)
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  const checkIsFavorite = async (req, res) => {
    
    try {
      const { userId, songId } = req.query;
      if (!userId || !songId) {
        return res.status(400).json({ message: 'Thiếu userId hoặc songId' });
      }
      const isFav = await songService.isFavorite({ userId, songId });
      res.status(200).json({ isFavorite: isFav });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const addSongToHistory = async (req, res) => {
    try {
      const { userId, songId, title, thumbnailM , genreIds, artist} = req.body;
      const result = await songService.addSongToHistory({ userId, songId, title, thumbnailM,genreIds,artist });
      res.status(200).json({
        message: '✅ Đã thêm vào lịch sử người nghe',
        song: result,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

module.exports = {
  addSongToFavorite,
  removeSongFromFavorite,
  getFavoritePlaylist,
  checkIsFavorite ,
  addSongToHistory
};
