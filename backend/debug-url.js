import cloudinary from './config/cloudinary.js';

// Simulate the public_id generation from routes/documents.js
const timestamp = Date.now();
const originalName = "test-file.pdf";
const name = originalName.split('.')[0];
const ext = ".pdf";
const public_id = `${timestamp}-${name}${ext}`;

console.log("Simulated Public ID:", public_id);

// Generate Signed URL as implemented in controller
const url = cloudinary.url(public_id, {
    resource_type: 'raw',
    type: 'upload',
    sign_url: true
});

console.log("Generated Signed URL:", url);

// Test without extension in public_id if that's the issue?
// But routes/documents.js explicitly adds it.
