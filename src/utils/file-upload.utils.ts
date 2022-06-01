import { UnsupportedMediaTypeException } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new UnsupportedMediaTypeException('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  const name = file.originalname.split('.')[0];
  const fileExtName = path.extname(file.originalname);
  const randomName = JSON.stringify(Date.now());
  callback(null, `${name}-${randomName}${fileExtName}`);
};
