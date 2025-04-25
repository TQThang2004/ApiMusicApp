const db = require("../config/db")
const { ZingMp3 } = require("zingmp3-api-full")

const createPlaylist = async (playlistData) => {
    const { name, userId } = playlistData

    const playlistsRef = db.ref("playlists")

    const snapshot = await playlistsRef
        .orderByChild("userId")
        .equalTo(userId)
        .once("value");

    if (snapshot.exists()) {
        const playlists = Object.values(snapshot.val());
        const duplicate = playlists.find(p => p.name.toLowerCase() === name.toLowerCase());

        if (duplicate) {
            throw new Error("Playlist name already exists")
        }
    }

    // Tạo một playlist mới
    const newPlaylistRef = playlistsRef.push()
    await newPlaylistRef.set({
        id: newPlaylistRef.key,
        name,
        userId,
        thumbnail: "https://i1.sndcdn.com/avatars-wpOz0Tqdl3eoO4WM-O3P1Qw-t240x240.jpg",
        song: {},
        createdAt: new Date().toISOString()
    })

    return { id: newPlaylistRef.key, name, userId, thumbnail: newPlaylistRef.thumbnail }
}

const getPlaylist = async (userId) => {
    const playlistsRef = db.ref("playlists");
    const snapshot = await playlistsRef.orderByChild("userId").equalTo(userId).once("value");
    return snapshot.val() ? Object.values(snapshot.val()) : [];
}

const getSongsFromPlaylist = async (playlistId) => {
    const playlistRef = db.ref("playlists").child(playlistId).child("songs")
    const snapshot = await playlistRef.once("value")

    if (!snapshot.exists()) {
        throw new Error("Playlist not found")
    }
    return snapshot.val() ? Object.values(snapshot.val()) : [];
}

const addSongToPlaylist = async (data) => {
    const { playlistId, songId } = data
    const songData = await ZingMp3.getInfoSong(songId)
    console.log("Song Data:", songData)
    console.log(songData.data.encodeId)

    const playlistsRef = db.ref("playlists").child(playlistId).child("songs")
    const snapshot = await playlistsRef.child(songId).once("value")

    if (snapshot.exists()) {
        throw new Error("Song already exists in the playlist")
    }

    await playlistsRef.child(songId).set({ 
        songId: songData.data.encodeId,
        songName: songData.data.title,
        artistsNames: songData.data.artistsNames,
        thumbnail: songData.data.thumbnail
    })

    const updatedPlaylistSnapshot = await db.ref("playlists").child(playlistId).once("value");
    const updatedPlaylist = updatedPlaylistSnapshot.val();
    const totalSongs = updatedPlaylist.song ? Object.keys(updatedPlaylist.song).length : 0;


    return {
        ...updatedPlaylist,
        totalSongs
    };
}

const removeSongFromPlaylist = async (data) => {
    const { playlistId, songId } = data;
  
    const songRef = db.ref("playlists").child(playlistId).child("songs").child(songId);
    const snapshot = await songRef.once("value");
  
    if (!snapshot.exists()) {
      throw new Error("Bài hát không tồn tại trong playlist");
    }
  
    // Xoá bài hát
    await songRef.remove();
  
    // Lấy lại dữ liệu playlist
    const updatedPlaylistSnapshot = await db.ref("playlists").child(playlistId).once("value");
    const updatedPlaylist = updatedPlaylistSnapshot.val();
  
    // Tính số lượng bài hát còn lại
    const totalSongs = updatedPlaylist.song ? Object.keys(updatedPlaylist.song).length : 0;
  
    return {
      ...updatedPlaylist,
      totalSongs
    };
  };
  

module.exports = {
    createPlaylist,
    addSongToPlaylist,
    getPlaylist,
    removeSongFromPlaylist,
    getSongsFromPlaylist
}