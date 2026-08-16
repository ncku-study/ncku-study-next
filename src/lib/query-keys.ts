export const ALL_COMMENTS_QUERY_KEY = [
  "comments",
  { college: "", department: "", year: "", category: "" },
] as const;

export const ALL_STUDIES_QUERY_KEY = [
  "studies",
  { categories: [], stats: [], years: [] },
] as const;
