import { Breadcrumbs, Anchor } from '@mantine/core';

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
export function AppBreadcrumbs({ items, paddingBottom = 30 }: AppBreadcrumbsProps) {
  return (
    <div style={{ paddingBottom }}>
      <Breadcrumbs separatorMargin="md" mt="xs" style={{ textAlign: 'left' }}>
        {items.map((item, index) =>
          item.href ? (
            <Anchor href={item.href} key={index}>
              {item.label}
            </Anchor>
          ) : (
            <span key={index}>{item.label}</span>
          )
        )}
      </Breadcrumbs>
    </div>
  );
}
