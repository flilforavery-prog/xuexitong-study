export function parseBank(source) {
  const bank = JSON.parse(source);
  if (!Array.isArray(bank) || bank.length === 0) {
    throw new Error("题库必须是非空数组。");
  }
  return bank.map((item, index) => {
    if (!item || typeof item.question !== "string" || !item.question.trim() ||
        !Array.isArray(item.options) || item.options.length < 2 ||
        !item.options.every((option) => typeof option === "string" && option.trim()) ||
        !Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length ||
        (item.explanation !== undefined && typeof item.explanation !== "string")) {
      throw new Error(`第 ${index + 1} 题格式错误，请参考示例题库。`);
    }
    return item;
  });
}
