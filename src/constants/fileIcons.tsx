import {
  IconFile,
  IconFileText,
  IconFileCode,
  IconFileExcel, IconFileTypeDoc,
  IconFileTypeDocx, IconFileTypeCsv, IconFileTypePdf, IconFileTypeJpg, IconFileTypePng
} from "@tabler/icons-react";
import React from "react";

export const FILE_ICONS: Record<string, React.ReactNode> = {
  // 文本类
  txt: <IconFileText size={18}/>,
  csv: <IconFileTypeCsv size={18}/>,

  // Office / 文档
  pdf: <IconFileTypePdf size={18}/>,
  doc: <IconFileTypeDoc size={18}/>,
  docx: <IconFileTypeDocx size={18}/>,
  xls: <IconFileExcel size={18}/>,
  xlsx: <IconFileExcel size={18}/>,
  ppt: <IconFileText size={18}/>,
  pptx: <IconFileText size={18}/>,

  // 代码 / 配置
  html: <IconFileCode size={18}/>,
  css: <IconFileCode size={18}/>,
  json: <IconFileCode size={18}/>,

  // 图片
  png: <IconFileTypePng size={18}/>,
  jpeg: <IconFileTypeJpg size={18}/>,
  jpg: <IconFileTypeJpg size={18}/>,

  // 兜底
  default: <IconFile size={18}/>,
};
