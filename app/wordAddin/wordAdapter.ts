export const WordAdapter = {
  async readSelection(): Promise<string> {
    if (typeof Office === "undefined") {
      throw new Error("Office.js is unavailable. Open this pane from Word and try again.");
    }
    await Office.onReady();
    if (typeof Word === "undefined") {
      throw new Error("The Word host is not ready. Close and reopen the add-in pane.");
    }
    return Word.run(async context => {
      const range = context.document.getSelection();
      range.load("text");
      await context.sync();
      return range.text;
    });
  },
  async insertText(text: string): Promise<void> {
    if (typeof Office === "undefined") {
      throw new Error("Office.js is unavailable. Open this pane from Word and try again.");
    }
    await Office.onReady();
    if (typeof Word === "undefined") {
      throw new Error("The Word host is not ready. Close and reopen the add-in pane.");
    }
    await Word.run(async context => {
      context.document.getSelection().insertText(text, Word.InsertLocation.replace);
      await context.sync();
    });
  },
};
