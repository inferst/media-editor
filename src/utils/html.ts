export const stripHtmlTags = (html: string) => {
  try {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    return parsed.body.textContent || "";
  } catch (error) {
    console.error("Error parsing HTML string:", error);
    return "";
  }
};
