import { describe, expect, it, vi } from "vitest";
import { migrateBundle } from "../migrations/migrate-bundle.js";
import type {
  IFileSystemAdapter,
  IFrontmatterParser,
} from "../domain/interfaces.js";

describe("migrateBundle", () => {
  it("identifies legacy files and updates them in-place when write is true", async () => {
    // Mock FileSystemAdapter
    const mockFiles = [
      "skills/typescript.md",
      "experiences/senior.md",
      "log.md",
    ];
    const mockFs: IFileSystemAdapter = {
      exists: vi.fn().mockResolvedValue(true),
      listFiles: vi.fn().mockResolvedValue(mockFiles),
      readFile: vi.fn().mockImplementation((path: string) => {
        if (path.endsWith("typescript.md")) {
          return "---\ntype: Skill\ntitle: TS\n---\nBody content";
        }
        if (path.endsWith("senior.md")) {
          return "---\ntype: Experience\nschemaVersion: akcp.profile/v1\n---\nBody senior";
        }
        return "";
      }),
      writeFile: vi.fn().mockResolvedValue(undefined),
      mkdir: vi.fn().mockResolvedValue(undefined),
      deleteFile: vi.fn().mockResolvedValue(undefined),
    };

    // Mock Parser
    const mockParser: IFrontmatterParser = {
      parse: vi.fn().mockImplementation((raw: string, file: string) => {
        if (file.endsWith("typescript.md")) {
          return {
            frontmatter: { type: "Skill", title: "TS" },
            body: "Body content",
            filePath: file,
            conceptId: "skills/typescript",
          };
        }
        return {
          frontmatter: { type: "Experience", schemaVersion: "akcp.profile/v1" },
          body: "Body senior",
          filePath: file,
          conceptId: "experiences/senior",
        };
      }),
      serialize: vi.fn().mockReturnValue("Serialized output"),
    };

    const report = await migrateBundle(mockFs, mockParser, "/okf", {
      write: true,
    });

    expect(report.success).toBe(true);
    expect(report.filesChecked).toBe(2); // typescript and senior
    expect(report.filesNeedingMigration).toBe(1); // typescript lacks schemaVersion
    expect(report.filesMigrated).toBe(1);
    expect(report.migratedFiles).toContain("skills/typescript");
    expect(mockFs.writeFile).toHaveBeenCalled();
  });
});
