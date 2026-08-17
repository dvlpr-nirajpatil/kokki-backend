const path = require("path");
const { Worker } = require("worker_threads");
const sharp = require("sharp");
const env = require("@config/env");

let activeHeicWorkers = 0;
const pendingHeicWorkers = [];

async function compressImage(inputPath, outputPath) {
    const image = sharp(inputPath, {
        failOn: "error",
        limitInputPixels: env.upload.imageMaxPixels,
        pages: 1,
    });

    await image.metadata();

    return image
        .rotate()
        .resize({
            width: env.upload.imageMaxWidth,
            withoutEnlargement: true,
        })
        .webp({
            quality: env.upload.imageWebpQuality,
            effort: 4,
            smartSubsample: true,
        })
        .toFile(outputPath);
}

function startHeicWorker(inputPath, outputPath) {
    const workerPath = path.join(__dirname, "heic.worker.js");

    return new Promise((resolve, reject) => {
        const worker = new Worker(workerPath, {
            workerData: {
                inputPath,
                outputPath,
                maxPixels: env.upload.imageMaxPixels,
                maxWidth: env.upload.imageMaxWidth,
                quality: env.upload.imageWebpQuality,
            },
            resourceLimits: {
                maxOldGenerationSizeMb: 256,
            },
        });

        let settled = false;
        const timeout = setTimeout(() => {
            if (settled) return;
            settled = true;
            worker.terminate();
            reject(new Error("HEIC processing timed out"));
        }, 60_000);

        worker.once("message", (message) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);

            if (message.ok) {
                resolve(message.info);
            } else {
                reject(new Error(message.error || "Unable to process HEIC image"));
            }
        });

        worker.once("error", (error) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            reject(error);
        });

        worker.once("exit", (code) => {
            if (settled || code === 0) return;
            settled = true;
            clearTimeout(timeout);
            reject(new Error(`HEIC worker stopped with exit code ${code}`));
        });
    });
}

function runWithHeicWorkerLimit(task) {
    return new Promise((resolve, reject) => {
        const run = async () => {
            activeHeicWorkers += 1;

            try {
                resolve(await task());
            } catch (error) {
                reject(error);
            } finally {
                activeHeicWorkers -= 1;
                pendingHeicWorkers.shift()?.();
            }
        };

        if (activeHeicWorkers < env.upload.heicMaxConcurrency) {
            run();
        } else {
            pendingHeicWorkers.push(run);
        }
    });
}

function compressHeicImage(inputPath, outputPath) {
    return runWithHeicWorkerLimit(() => startHeicWorker(inputPath, outputPath));
}

module.exports = {
    compressImage,
    compressHeicImage,
};
