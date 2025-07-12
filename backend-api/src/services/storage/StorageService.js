const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

class StorageService {
  constructor() {
    this._folder = path.resolve(__dirname, '../../uploads/images');

    if (!fs.existsSync(this._folder)) {
      fs.mkdirSync(this._folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = `${nanoid(16)}-${meta.filename}`;
    const filepath = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(filepath);
    file.pipe(fileStream);

    return new Promise((resolve, reject) => {
      file.on('end', () => resolve(filename));
      file.on('error', reject);
    });
  }
}

module.exports = StorageService;