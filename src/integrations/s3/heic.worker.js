const { readFile } = require("fs/promises");
const { parentPort, workerData } = require("worker_threads");
const decodeHeic = require("heic-decode");
const sharp = require("sharp");

async function processHeic() {
    const input = await readFile(workerData.inputPath);
    const images = await decodeHeic.all({ buffer: input });

    try {
        const primaryImage = images[0];
        const pixelCount = primaryImage.width * primaryImage.height;

        if (!Number.isSafeInteger(pixelCount) || pixelCount > workerData.maxPixels) {
            throw new Error("Image dimensions exceed the configured pixel limit");
        }

        const decoded = await primaryImage.decode();
        const rawPixels = Buffer.from(
            decoded.data.buffer,
            decoded.data.byteOffset,
            decoded.data.byteLength,
        );

        return sharp(rawPixels, {
            raw: {
                width: decoded.width,
                height: decoded.height,
                channels: 4,
            },
            limitInputPixels: workerData.maxPixels,
        })
            .resize({
                width: workerData.maxWidth,
                withoutEnlargement: true,
            })
            .webp({
                quality: workerData.quality,
                effort: 4,
                smartSubsample: true,
            })
            .toFile(workerData.outputPath);
    } finally {
        images.dispose();
    }
}

processHeic()
    .then((info) => parentPort.postMessage({ ok: true, info }))
    .catch((error) => {
        parentPort.postMessage({ ok: false, error: error.message });
    });
