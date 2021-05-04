import {readdir, writeFile} from 'fs-extra';
import sizeOf from 'image-size';
import {join} from 'path';
import {imageDataFilePath} from '../file-name';
import {ImageInfo} from '../image-info';

async function main() {
    const files = await readdir('images');
    const imageFiles = files
        .filter((fileName) => fileName.toLocaleUpperCase().endsWith('.JPG'))
        .map((imageName) => join('images', imageName));

    const mapped = imageFiles.map(
        (imageFile): ImageInfo => {
            const size = sizeOf(imageFile);

            if (size.height == undefined || size.width == undefined) {
                throw new Error(`Unable to get size for ${imageFile}`);
            }

            const result: ImageInfo = {
                size: {width: size.width, height: size.height},
                path: imageFile,
            };

            return result;
        },
    );

    await writeFile(imageDataFilePath, JSON.stringify(mapped));
}

main().catch((error) => console.error(error));
