type Song = {
    songId: string;
    encodeId?: string;
    genreIds: string[];
    title: string;
    artist: string;
    thumbnailM: string;
    weight?: number;
  };
  
  export function getRecommendations(
    favoriteSongs: Song[],
    historySongs: Song[],
    candidateSongs: Song[],
    topN: number = 10
  ): Song[] {
    const genreWeight: Record<string, number> = {};
    const artistWeight: Record<string, number> = {};
    const combined: Song[] = [];
  
    // Favorite weight = 2
    favoriteSongs.forEach(song => {
      const songId = song.songId || song.encodeId;
      if (songId) {
        combined.push({ ...song, songId, weight: 2 });
      }
    });
  
    // History weight = 1
    historySongs.forEach(song => {
      const songId = song.encodeId || song.songId;
      const exists = combined.find(s => s.songId === songId);
      if (!exists && songId) {
        combined.push({ ...song, songId, weight: 1 });
      }
    });
  
    // Tính trọng số genre và artist
    combined.forEach(song => {
      song.genreIds?.forEach(genre => {
        genreWeight[genre] = (genreWeight[genre] || 0) + (song.weight || 1);
      });
      if (song.artist) {
        artistWeight[song.artist] = (artistWeight[song.artist] || 0) + (song.weight || 1);
      }
    });
  
    // Tính điểm và gợi ý
    const scored = candidateSongs.map(song => {
      let score = 0;
  
      song.genreIds?.forEach(genre => {
        score += genreWeight[genre] || 0;
      });
  
      if (song.artist) {
        score += artistWeight[song.artist] || 0;
      }
  
      return { ...song, score };
    });
  
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }
  