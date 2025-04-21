const { ZingMp3 } = require("zingmp3-api-full")


class ZingController {

    getSong(req, res) {
        console.log("Song ID:", req.query.encodeId);

        ZingMp3.getSong(req.query.encodeId).then((data) => {
            res.json(data)
            console.log("D  :",data)
        })
    }

    getDetailPlaylist(req, res) {
        ZingMp3.getDetailPlaylist(req.query.encodeId).then((data) => {
            res.json(data)
        })
    }

    getHome(req, res) {
        ZingMp3.getHome().then((data) => {
            res.json(data)
        })
    }

    getTop100(req, res) {
        ZingMp3.getTop100().then((data) => {
            res.json(data);
        })
    }

    getChartHome(req, res) {
        ZingMp3.getChartHome().then((data) => {
            res.json(data);
        })
    }

    getNewReleaseChart(req, res) {
        ZingMp3.getNewReleaseChart().then((data) => {
            res.json(data)
        })
    }

    getInfo(req, res) {
        ZingMp3.getInfoSong(req.query.encodeId).then((data) => {
            res.json(data);
        })
    }

    getArtist(req, res) {
        ZingMp3.getArtist(req.query.name).then((data) => {
            res.json(data)
        })
    }

    getArtistSong(req, res) {
        ZingMp3.getListArtistSong(req.query.encodeId, req.query.page, req.query.count).then((data) => {
            res.json(data)
        })
    }

    getLyric(req, res) {
        ZingMp3.getLyric(req.query.encodeId).then((data) => {
            res.json(data)
        })
    }

    search(req, res) {
        ZingMp3.search(req.query.keyword).then((data) => {
            res.json(data)
        })
    }

    getListMV(req, res) {
        ZingMp3.getListMV(req.query.encodeId, req.query.page, req.query.count).then((data) => {
            res.json(data)
        })
    }

    getCategoryMV(req, res) {
        ZingMp3.getCategoryMV(req.query.encodeId).then((data) => {
            res.json(data)
        })
    }

    getVideo(req, res) {
        ZingMp3.getVideo(req.query.encodeId).then((data) => {
            res.json(data)
        })
    }

}

module.exports = new ZingController
