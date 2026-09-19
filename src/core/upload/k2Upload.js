import axios from "axios";
import {
  API_FAILURE_KIND,
  ApiFailure,
  assertSuccessfulEnvelope,
  toApiFailure,
} from "../http/ApiFailure";
import apiClient from "../../services/api/client/apiClient";

const PRESIGNED_UPLOAD_ENDPOINT = "/manageBucketS3/getPresignedUrl";
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const MIME_BY_EXTENSION = {
  csv: "text/csv",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  heic: "image/heic",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  pdf: "application/pdf",
  png: "image/png",
  webp: "image/webp",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const extensionOf = (fileName) => {
  const dot = fileName.lastIndexOf(".");
  return dot > -1 ? fileName.slice(dot + 1).toLowerCase() : "";
};

const validationFailure = (message) =>
  new ApiFailure({
    kind: API_FAILURE_KIND.validation,
    message,
    fieldErrors: { file: message },
  });

export const validateK2UploadFile = (
  file,
  { maxBytes = MAX_UPLOAD_BYTES } = {},
) => {
  if (!file || typeof file.name !== "string" || typeof file.size !== "number") {
    throw validationFailure("Choose a file to upload.");
  }

  const extension = extensionOf(file.name);
  const mimeType = MIME_BY_EXTENSION[extension];
  if (!mimeType) {
    throw validationFailure("This file type is not supported.");
  }

  if (file.type && file.type !== mimeType) {
    throw validationFailure("The file extension does not match its content type.");
  }

  if (file.size <= 0) {
    throw validationFailure("The selected file is empty.");
  }

  if (file.size > maxBytes) {
    throw validationFailure("The selected file is larger than 10 MB.");
  }

  return { extension, mimeType };
};

export const requestK2PresignedUpload = async ({ extension, signal } = {}) => {
  const { data } = await apiClient.get(PRESIGNED_UPLOAD_ENDPOINT, {
    params: { fileType: extension },
    signal,
  });
  const response = assertSuccessfulEnvelope(data, "getPresignedUrl");
  const uploadUrl = response?.presigned_url?.toString();
  const publicUrl = response?.cloudfront_url?.toString();

  if (!uploadUrl || !publicUrl) {
    throw new ApiFailure({
      kind: API_FAILURE_KIND.parse,
      message: "The upload service returned an incomplete upload URL.",
    });
  }

  return { publicUrl, uploadUrl };
};

export const uploadToK2PresignedUrl = async ({
  file,
  mimeType,
  signal,
  uploadUrl,
}) => {
  try {
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": mimeType },
      signal,
      timeout: 60000,
    });
  } catch (error) {
    throw toApiFailure(error);
  }
};

export const uploadK2File = async (
  file,
  {
    requestPresignedUpload = requestK2PresignedUpload,
    signal,
    upload = uploadToK2PresignedUrl,
  } = {},
) => {
  const { extension, mimeType } = validateK2UploadFile(file);
  const { publicUrl, uploadUrl } = await requestPresignedUpload({
    extension,
    signal,
  });

  await upload({ file, mimeType, signal, uploadUrl });

  return {
    fileName: file.name,
    mimeType,
    publicUrl,
    sizeBytes: file.size,
  };
};
