import 'dotenv/config';
import * as cloudinaryPkg from 'cloudinary';

const cld: any = (cloudinaryPkg as any).v2;
cld.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const remote =
  'https://madeirasamazonas.com.br/wp-content/uploads/2025/06/cozinha-personalizada-com-mdf-gianduia-e-vidro-reflecta-bronze-em-estilo-contemporaneo.webp';

(async () => {
  try {
    console.log('cloudname=', process.env.CLOUDINARY_CLOUD_NAME);
    const result = await cld.uploader.upload(remote, { folder: 'rsmoveis' });
    console.log('SECURE_URL=' + result.secure_url);
    console.log('WIDTH=' + result.width + ' HEIGHT=' + result.height);
    console.log('FORMAT=' + result.format);
  } catch (e: any) {
    console.error('ERRO_REMOTE=', e.message);
    process.exit(1);
  }
})();