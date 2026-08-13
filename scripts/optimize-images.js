"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const projectRoot = path.resolve(__dirname, "..");

const images = [
    ["assets/images/slide/hero-01.webp", 960],
    ["assets/images/slide/hero-02.webp", 540],
    ["assets/images/slide/hero-03.webp", 540],
    ["assets/images/slide/hero-04.webp", 960],
    ["assets/images/visual-story.webp", 360],
    ["assets/images/meals/meals.webp", 720],
    ["assets/images/space/learning-area.webp", 600],
    ["assets/images/space/arts.webp", 600],
    ["assets/images/space/playground.webp", 700],
    ["assets/images/space/classroom.webp", 700],
    ["assets/images/space/meals.webp", 700],
    ["assets/images/space/rest.webp", 600],
    ["assets/images/educator/luciene.webp", 360]
];

async function optimize() {
    for (const [relativePath, width] of images) {
        const inputPath = path.join(projectRoot, relativePath);
        const extension = path.extname(inputPath);
        const outputPath = inputPath.replace(
            extension,
            `-${width}w${extension}`
        );

        await sharp(inputPath)
            .resize({
                width,
                withoutEnlargement: true
            })
            .webp({
                quality: 78,
                effort: 5
            })
            .toFile(outputPath);

        const before = fs.statSync(inputPath).size;
        const after = fs.statSync(outputPath).size;

        console.log(
            `${path.relative(projectRoot, outputPath)}: ${before} -> ${after} bytes`
        );
    }
}

optimize().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
