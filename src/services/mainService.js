const db = require("../config/db")
const { ZingMp3 } = require("zingmp3-api-full")

const createPlaylist = async (playlistData) => {
    const { name, userId } = playlistData;
    const playlistsRef = db.ref(`users/${userId}/playlists`);


    const snapshot = await playlistsRef.once("value");
    if (snapshot.exists()) {
        const playlists = snapshot.val();
        const duplicate = Object.values(playlists).find(p => p.name.toLowerCase() === name.toLowerCase());

        if (duplicate) {
            throw new Error("Playlist name already exists");
        }
    }

    // Tạo playlist mới
    const newPlaylistRef = playlistsRef.push();
    await newPlaylistRef.set({
        id: newPlaylistRef.key,
        name,
        thumbnail: "https://i1.sndcdn.com/avatars-wpOz0Tqdl3eoO4WM-O3P1Qw-t240x240.jpg",
        song: {},
        createdAt: new Date().toISOString(),
    });

    return { id: newPlaylistRef.key, name, userId, thumbnail: "https://i1.sndcdn.com/avatars-wpOz0Tqdl3eoO4WM-O3P1Qw-t240x240.jpg" };
};

const getPlaylist = async (userId) => {

    const playlistsRef = db.ref(`users/${userId}/playlists`);
    const snapshot = await playlistsRef.once("value");

    if (!snapshot.exists()) {
        return [];
    }
    const playlists = snapshot.val();

    const result = Object.values(playlists);

    return result;
};

const removePlaylist = async (data) => {
    const { userId, playlistId } = data;
    const playlistRef = db.ref(`users/${userId}/playlists/${playlistId}`);
    const snapshot = await playlistRef.once("value");

    if (!snapshot.exists()) {
        throw new Error("Playlist không tồn tại");
    }

    await playlistRef.remove();

    return { message: "Xoá playlist thành công" };
}


const addSongToPlaylist = async ({ userId, playlistId, songId }) => {
    if (!userId || !playlistId || !songId) {
        throw new Error("Thiếu userId, playlistId hoặc songId");
    }

    const songRef = db.ref(`users/${userId}/playlists/${playlistId}/songs/${songId}`);

    const snapshot = await songRef.once("value");

    if (snapshot.exists()) {
        throw new Error("Bài hát đã tồn tại trong playlist");
    }

    const songInfo = await ZingMp3.getInfoSong(songId);

    if (!songInfo.data) {
        throw new Error("Không thể lấy thông tin bài hát");
    }

    // Lưu thông tin chi tiết của bài hát
    await songRef.set({
        encodeId: songId,
        thumbnailM: songInfo.data.thumbnailM,
        title: songInfo.data.title,
        artistsNames: songInfo.data.artistsNames
    });

    return { playlistId, songId };
};

const getSongsFromPlaylist = async ({ userId, playlistId }) => {
    if (!userId || !playlistId) {
        throw new Error("Thiếu userId hoặc playlistId");
    }

    const playlistRef = db.ref(`users/${userId}/playlists/${playlistId}/songs`);
    const snapshot = await playlistRef.once("value");

    if (!snapshot.exists()) {
        return [];
    }

    const songs = snapshot.val();
    return Object.values(songs).map(song => ({
        encodeId: song.encodeId,
        thumbnailM: song.thumbnailM,
        title: song.title,
        artistsNames: song.artistsNames
    }));
};

const removeSongFromPlaylist = async (data) => {
    const { userId, playlistId, songId } = data;

    const songRef = db.ref(`users/${userId}/playlists/${playlistId}/songs/${songId}`);
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
    removePlaylist,
    getSongsFromPlaylist
}