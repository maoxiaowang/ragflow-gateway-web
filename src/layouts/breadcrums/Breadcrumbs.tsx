import { Breadcrumbs as _Breadcrumbs, Anchor } from '@mantine/core';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
  paddingBottom?: number;
}

/**
 * 通用面包屑组件
 */
export function Breadcrumbs({ items, paddingBottom = 30 }: AppBreadcrumbsProps) {
  return (
    <div style={{ paddingBottom }}>
      <_Breadcrumbs separatorMargin="md" mt="xs" style={{ textAlign: 'left' }}>
        {items.map((item, index) =>
          item.href ? (
            <Anchor href={item.href} key={index}>
              {item.label}
            </Anchor>
          ) : (
            <span key={index}>{item.label}</span>
          )
        )}
      </_Breadcrumbs>
    </div>
  );
}
