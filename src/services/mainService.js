const db = require("../config/db")

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

const addSongToPlaylist = async (playlistId, songId) => {
    const playlistsRef = db.ref("playlists").child(playlistId).child("song")
    const snapshot = await playlistsRef.child(songId).once("value")

    if (snapshot.exists()) {
        throw new Error("Song already exists in the playlist")
    }

    await playlistsRef.child(songId).set({ id: songId })
}

module.exports = {
    createPlaylist,
    addSongToPlaylist,
    getPlaylist
}