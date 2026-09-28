export const OutlookAdapter = {
  async getSubject(): Promise<string> {
    if (typeof Office === "undefined") return "";
    const item = Office.context.mailbox.item;
    return new Promise(resolve =>
      item?.subject.getAsync(result =>
        resolve(result.status === Office.AsyncResultStatus.Succeeded ? result.value : ""),
      ),
    );
  },
  getItemId(): string | null {
    return typeof Office === "undefined" ? null : (Office.context.mailbox.item?.itemId ?? null);
  },
};
