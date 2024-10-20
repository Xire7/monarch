export const issues = [
  {
    message: "No null values found in your datasets.",
    additional_info: "",
    cols_used: [],
  },
  {
    message: "There are no unmatched columns in your datasets.",
    additional_info: "",
    cols_used: [],
  },
  {
    message: "Columns full_name, name, and employee can be merged.",
    additional_info:
      "These columns showed high distribution similarity and fuzzy similarity.",
    cols_used: ["full_name", "name", "employee"],
  },
  {
    message: "Columns birth_date, birth_year, and age can be merged.",
    additional_info:
      "These columns had high fuzzy similarity, but no other notable similarities.",
    cols_used: ["birth_date", "birth_year", "age"],
  },
  {
    message: "Columns occupation, job_title, and profession can be merged.",
    additional_info:
      "These columns demonstrated high distribution similarity and fuzzy similarity.",
    cols_used: ["occupation", "job_title", "profession"],
  },
  {
    message: "Columns annual_income and salary can be merged.",
    additional_info:
      "These columns showed high spearman similarity, indicating a strong correlation.",
    cols_used: ["annual_income", "salary"],
  },
  {
    message: "Columns location, city can be merged.",
    additional_info:
      "These columns had high distribution similarity and semantic similarity.",
    cols_used: ["location", "city"],
  },
  {
    message: "Columns latitude, longitude, and city can be merged.",
    additional_info: "These columns demonstrated high fuzzy similarity.",
    cols_used: ["latitude", "longitude", "city"],
  },
  {
    message: "Columns longitude, location, and latitude can be merged.",
    additional_info:
      "These columns showed high fuzzy similarity, but no other notable similarities.",
    cols_used: ["longitude", "location", "latitude"],
  },
];