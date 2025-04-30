const db = require("../config/db")

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


const addSongToPlaylist = async ({ userId, playlistId, songId }) => {
    if (!userId || !playlistId || !songId) {
        throw new Error("Thiếu userId, playlistId hoặc songId");
    }

    const songRef = db.ref(`users/${userId}/playlists/${playlistId}/song/${songId}`);
    
    const snapshot = await songRef.once("value");

    if (snapshot.exists()) {
        throw new Error("Bài hát đã tồn tại trong playlist");
    }

    await songRef.set({
        id: songId
    });

    return { playlistId, songId };
};

module.exports = {
    createPlaylist,
    addSongToPlaylist,
    getPlaylist
}