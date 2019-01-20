const task = require(".");

describe("task", () => {
  it("should return a function", () => {
    expect(task.create).toBeInstanceOf(Function);
  });

  it("should build a task", () => {
    const zipTask = task.create();
    expect(zipTask).toBeInstanceOf(Function);
    expect(zipTask.watch).toBeInstanceOf(Function);
    expect(zipTask.displayName).toBe("zip");
    expect(zipTask).toHaveProperty("description");
  });

  it("should not have dots", () => {
    const zipTask = task.create({ outFile: { noDots: true } });
    console.log(zipTask._archiveDir);
    expect(zipTask._archiveDir).not.toMatch(/[.]/);
  });

  it("should use a fake git hash", () => {
    const zipTask = task.create({ outFile: { gitHash: "crocodile" } });
    console.log(zipTask._archiveDir);
    expect(zipTask._archiveDir).toContain("crocodile");
  });

  it("should use a fake git hash", () => {
    const zipTask = task.create({ outFile: { gitHash: "crocodile" } });
    console.log(zipTask._archiveDir);
    expect(zipTask._archiveDir).toContain("crocodile");
  });

  it("should not allow empty archive directory names", () => {
    const zipTask = () =>
      task.create({
        outFile: { baseName: "", version: false, gitHash: false }
      });
    expect(zipTask).toThrowError();
  });
});
