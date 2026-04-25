export function formatLongDate(isoDate: string, locale?: string) {
     const date = new Date(isoDate);
     if (!Number.isFinite(date.getTime())) return isoDate;

     const resolvedLocale =
          locale === "ar" ? "ar" : locale === "en" ? "en-US" : locale;

     return new Intl.DateTimeFormat(resolvedLocale, {
          month: "long",
          day: "2-digit",
          year: "numeric",
     }).format(date);
}
