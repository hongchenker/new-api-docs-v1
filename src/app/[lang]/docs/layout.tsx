import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, linkItems, getExtraLinks } from '@/lib/layout.shared';
import { Footer } from '@/components/footer';
// import { ComplianceNotice } from '@/components/compliance-notice';
// AI feature temporarily disabled
// import { AISearchTrigger } from '@/components/search';
import 'katex/dist/katex.min.css';
import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;

  // Check if the language is valid, prevent invalid language codes (e.g. 'api') from causing errors
  if (!i18n.languages.includes(lang as (typeof i18n.languages)[number])) {
    notFound();
  }

  const base = baseOptions(lang);

  const extraLinks = getExtraLinks(lang) as Array<{ url: string; text: string }>;

  return (
    <>
      {extraLinks.length > 0 && (
        <div className="fixed top-0 right-0 z-50 flex items-center gap-3 px-6 py-1.5 text-sm max-md:hidden">
          {extraLinks.map((item, index) => {
            const isButton = index === extraLinks.length - 1;
            return (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'transition-colors',
                  isButton
                    ? 'rounded-md bg-fd-primary px-4 py-1.5 text-fd-primary-foreground hover:bg-fd-primary/90'
                    : 'text-fd-muted-foreground hover:text-fd-foreground',
                )}
              >
                {item.text}
                {isButton && (
                  <svg className="ml-1 inline-block size-3.5 align-[-1px]" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 3.5L10.5 8L5.5 12.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>
            );
          })}
        </div>
      )}
      <DocsLayout
        {...base}
        tabMode="top"
        tree={source.pageTree[lang]}
        //links={linkItems.filter((item) => item.type === 'icon')}
        sidebar={{
          defaultOpenLevel: 0,
          tabs: {
            transform(option, node) {
              if (!node.icon) return option;

              return {
                ...option,
                icon: (
                  <div className="max-md:bg-fd-primary/10 max-md:border-fd-primary/20 size-full rounded-lg max-md:border max-md:p-1.5 [&_svg]:size-full">
                    {node.icon}
                  </div>
                ),
              };
            },
          },
        }}
      >
        {/* <ComplianceNotice lang={lang} />*/}
        {children}
        {/* <Footer lang={lang} />*/}
        {/* AI feature temporarily disabled */}
        {/* <AISearchTrigger /> */}
      </DocsLayout>
    </>
  );
}
