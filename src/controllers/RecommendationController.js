const recommendationService = require('../services/recommendationService');
const { getRecommendationsV2 } = require('../services/recommendationV2');

const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Thiếu userId' });
    }

    const recommendedSongs = await getRecommendationsV2(userId);
    console.log("Recommendation Song:", recommendedSongs);
    
    res.status(200).json({
      message: '🎧 Gợi ý bài hát thành công',
      recommendations: recommendedSongs,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: error?.message || 'Lỗi không xác định' });

  }
};

module.exports = {
  getRecommendations,
};
