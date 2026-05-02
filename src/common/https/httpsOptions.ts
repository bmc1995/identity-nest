import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs';
import * as path from 'path';

const certDir = path.join(__dirname);

export const httpsOptions: HttpsOptions = {
  cert: fs.readFileSync(path.join(certDir, 'cert.crt')),
  key: fs.readFileSync(path.join(certDir, 'key.pem')),
};
