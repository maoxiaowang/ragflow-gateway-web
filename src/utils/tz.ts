/**
 * RAGFlow的数据是上海时间，将上海时间（UTC+8）字符串转换为前端显示时间
 * @param shanghaiTime 数据库时间字符串或 Date 对象
 * @param options 可选，toLocaleString 的格式化选项
 * @returns 格式化后的时间字符串
 */
export function formatShanghaiTime(
  shanghaiTime: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof shanghaiTime === "string" ? new Date(shanghaiTime) : shanghaiTime;

  // 将上海时间减去8小时，得到 UTC 时间
  const utcTime = new Date(date.getTime() - 8 * 60 * 60 * 1000);

  // 返回本地显示时间
  return utcTime.toLocaleString(undefined, options);
}
