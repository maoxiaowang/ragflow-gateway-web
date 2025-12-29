export function getFileColor(suffix?: string) {
  switch (suffix?.toLowerCase()) {
    case "pdf":
      return "red";
    case "doc":
    case "docx":
      return "blue";
    case "xls":
    case "xlsx":
      return "green";
    case "ppt":
    case "pptx":
      return "orange";
    case "csv":
      return "teal";
    case "html":
    case "css":
    case "json":
      return "gray";
    case "png":
    case "jpeg":
    case "jpg":
      return "violet";
    default:
      return "gray";
  }
}