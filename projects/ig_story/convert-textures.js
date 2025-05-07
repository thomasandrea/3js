import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'public/textures');
const outputDir = path.join(__dirname, 'public/textures-ktx2');
const tempDir = path.join(__dirname, '_temp-resized');

const validExtensions = ['.png', '.jpg', '.jpeg'];
const MAX_SIZE = 2048;

fs.ensureDirSync(outputDir);
fs.ensureDirSync(tempDir);

function nearestPowerOf2(x) {
  return Math.pow(2, Math.ceil(Math.log2(x)));
}

async function findAllImages(dir) {
  let files = [];
  for (const file of await fs.readdir(dir)) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      const subFiles = await findAllImages(fullPath);
      files = files.concat(subFiles);
    } else if (validExtensions.includes(path.extname(file).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function processImage(filePath) {
  const relativePath = path.relative(inputDir, filePath);
  const { dir, name } = path.parse(relativePath);

  const originalImage = sharp(filePath).ensureAlpha();
  const metadata = await originalImage.metadata();

  // Resize with constraint to MAX_SIZE
  let scale = Math.min(1, MAX_SIZE / metadata.width, MAX_SIZE / metadata.height);
  const resizedWidth = Math.floor(metadata.width * scale);
  const resizedHeight = Math.floor(metadata.height * scale);

  // Pad to next power of 2
  const targetWidth = Math.min(MAX_SIZE, nearestPowerOf2(resizedWidth));
  const targetHeight = Math.min(MAX_SIZE, nearestPowerOf2(resizedHeight));

  const resizedBuffer = await originalImage
    .resize(resizedWidth, resizedHeight)
    .extend({
      top: 0,
      bottom: targetHeight - resizedHeight,
      left: 0,
      right: targetWidth - resizedWidth,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .flip()
    .toBuffer();

  const paddedPath = path.join(tempDir, `${name}_padded.png`);
  await sharp(resizedBuffer).toFile(paddedPath);

  const outputFolder = path.join(outputDir, dir);
  await fs.ensureDir(outputFolder);
  const outputPath = path.join(outputFolder, `${name}.ktx2`);

  try {
    execSync(`toktx --bcmp "${outputPath}" "${paddedPath}"`);
    console.log(`✅ Converted: ${relativePath} → ${path.join(dir, name)}.ktx2`);
  } catch (err) {
    console.error(`❌ Failed: ${relativePath} - ${err.message}`);
  }
}

async function run() {
  const imageFiles = await findAllImages(inputDir);
  for (const filePath of imageFiles) {
    await processImage(filePath);
  }

  await fs.remove(tempDir);
}

run();
