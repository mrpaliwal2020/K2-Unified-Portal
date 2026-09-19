# Portal Upload Core

`src/core/upload/k2Upload.js` is the Portal's reusable browser upload flow.

1. `validateK2UploadFile` validates the selected file before a network call.
   Supported types are JPEG, PNG, WebP, HEIC, PDF, CSV, Word, and Excel; the
   default maximum is 10 MB.
2. `requestK2PresignedUpload` requests a short-lived upload URL through the
   existing K2 `manageBucketS3/getPresignedUrl?fileType=` contract.
3. `uploadToK2PresignedUrl` awaits the raw browser PUT with the validated MIME
   type.
4. `uploadK2File` returns the CDN URL only after the PUT succeeds.

Feature code must persist the returned `publicUrl` through its own domain API
only after upload completes. Do not store a presigned URL, claim upload success
before the PUT resolves, or upload through the Portal server.

The core validates browser metadata for user feedback; the backend and bucket
policy remain authoritative for MIME, file size, access, expiry, and malware
scanning. A page that needs a different limit or file policy requires a
documented backend contract, not a page-local bypass.
