const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const { unlink } = require("fs/promises");
const env = require("@config/env");

const TEMP_DIR = path.join(os.tmpdir(), "kokki-uploads");

fs.mkdirSync(TEMP_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: TEMP_DIR,

    filename: (req, file, cb) => {
        cb(null, crypto.randomUUID());
    },
});

const upload = multer({
    storage,

    limits: {
        fileSize: env.upload.maxFileSizeBytes,
        files: env.upload.maxFiles,
        fields: 5,
        parts: env.upload.maxFiles + 5,
    },
});

const uploadArray = upload.array("files", env.upload.maxFiles);

async function removeTempFiles(files = []) {
    await Promise.allSettled(files.map((file) => unlink(file.path)));
}

function uploadFiles(req, res, next) {
    uploadArray(req, res, (error) => {
        if (!error) return next();

        return removeTempFiles(req.files).finally(() => next(error));
    });
}

module.exports = {
    uploadFiles,
    removeTempFiles,
};
