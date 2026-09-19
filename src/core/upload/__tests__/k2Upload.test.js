import { describe, expect, it, vi } from "vitest";
import { ApiFailure } from "../../http/ApiFailure";
import { uploadK2File, validateK2UploadFile } from "../k2Upload";

const createFile = (name, type, contents = "test") =>
  new File([contents], name, { type });

describe("K2 presigned upload", () => {
  it("rejects an unsupported or mismatched file before requesting an upload URL", () => {
    expect(() => validateK2UploadFile(createFile("record.exe", "application/octet-stream")))
      .toThrow(ApiFailure);
    expect(() => validateK2UploadFile(createFile("record.pdf", "image/png")))
      .toThrow("extension does not match");
  });

  it("uploads the validated file before returning its public URL", async () => {
    const file = createFile("report.pdf", "application/pdf");
    const requestPresignedUpload = vi.fn().mockResolvedValue({
      uploadUrl: "https://bucket.example/upload",
      publicUrl: "https://cdn.example/report.pdf",
    });
    const upload = vi.fn().mockResolvedValue(undefined);

    const uploaded = await uploadK2File(file, {
      requestPresignedUpload,
      upload,
    });

    expect(requestPresignedUpload).toHaveBeenCalledWith({
      extension: "pdf",
      signal: undefined,
    });
    expect(upload).toHaveBeenCalledWith({
      file,
      mimeType: "application/pdf",
      signal: undefined,
      uploadUrl: "https://bucket.example/upload",
    });
    expect(uploaded.publicUrl).toBe("https://cdn.example/report.pdf");
  });
});
