import { describe, expect, it } from "vitest";

import { MAX_DOCUMENT_SIZE_BYTES, validateDocumentFile } from "./document";

function file(input: { name: string; type: string; size?: number }) {
  const size = input.size ?? 10;
  return new File([new Uint8Array(size)], input.name, { type: input.type });
}

describe("validateDocumentFile", () => {
  it("accepts supported files with matching extensions", () => {
    expect(validateDocumentFile(file({ name: "seguro.pdf", type: "application/pdf" }))).toBeNull();
    expect(validateDocumentFile(file({ name: "foto.jpeg", type: "image/jpeg" }))).toBeNull();
    expect(validateDocumentFile(file({ name: "certificado.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }))).toBeNull();
  });

  it("rejects a supported MIME type with a misleading extension", () => {
    expect(validateDocumentFile(file({ name: "factura.exe", type: "application/pdf" }))).toBe(
      "La extension del archivo no coincide con el tipo permitido."
    );
  });

  it("rejects empty or oversized files", () => {
    expect(validateDocumentFile(file({ name: "vacio.pdf", type: "application/pdf", size: 0 }))).toBe("El archivo esta vacio.");
    expect(validateDocumentFile(file({ name: "grande.pdf", type: "application/pdf", size: MAX_DOCUMENT_SIZE_BYTES + 1 }))).toBe(
      "El archivo supera el limite de 10 MB."
    );
  });
});
