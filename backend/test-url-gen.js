import cloudinary from './config/cloudinary.js';

const publicId = 'antigravity-docs/test-file';

console.log("Generating URL with sign_url: false, secure: true");
const url = cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'upload',
    sign_url: false,
    secure: true
});

console.log("Result:", url);
