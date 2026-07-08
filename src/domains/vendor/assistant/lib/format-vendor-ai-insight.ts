/** Formats list fields from vendor AI endpoints into chat-friendly plain text. */
export function formatInsightReply({
  summary,
  highlights = [],
  recommendations = [],
  warnings = [],
  priorities = [],
  opportunities = [],
  alerts = []
}: {
  summary?: string;
  highlights?: string[];
  recommendations?: string[];
  warnings?: string[];
  priorities?: string[];
  opportunities?: string[];
  alerts?: string[];
}) {
  const sections: string[] = [];

  if (summary?.trim()) {
    sections.push(summary.trim());
  }

  const appendList = (title: string, items: string[]) => {
    const filtered = items.map((item) => item.trim()).filter(Boolean);
    if (filtered.length === 0) {
      return;
    }
    sections.push(`${title}\n${filtered.map((item) => `• ${item}`).join('\n')}`);
  };

  appendList('Priorities', priorities);
  appendList('Highlights', highlights);
  appendList('Opportunities', opportunities);
  appendList('Recommendations', recommendations);
  appendList('Alerts', alerts);
  appendList('Warnings', warnings);

  return sections.join('\n\n').trim();
}
