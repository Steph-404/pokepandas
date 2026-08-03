export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  citation: string;
}

export const QUESTION_BANK: Question[] = [
  {
    id: "q1",
    text: "How do you view the first 5 rows of a DataFrame `df`?",
    options: ["df.start()", "df.first(5)", "df.head()", "df.top()"],
    correctIndex: 2,
    citation: "[cite: 1]"
  },
  {
    id: "q2",
    text: "What is the primary difference between `.loc` and `.iloc`?",
    options: [
      ".loc is for labels, .iloc is for integer positions",
      ".loc is for positions, .iloc is for labels",
      ".loc is for rows, .iloc is for columns",
      "There is no difference"
    ],
    correctIndex: 0,
    citation: "[cite: 1]"
  },
  {
    id: "q3",
    text: "Which command drops rows containing any missing values?",
    options: ["df.drop_null()", "df.dropna()", "df.fillna()", "df.remove_missing()"],
    correctIndex: 1,
    citation: "[cite: 2]"
  },
  {
    id: "q4",
    text: "How do you find the total number of missing values per column?",
    options: ["df.isna().sum()", "df.missing()", "df.count_null()", "df.isna().count()"],
    correctIndex: 0,
    citation: "[cite: 2]"
  },
  {
    id: "q5",
    text: "Which command converts a text column \"date\" into actual datetime objects?",
    options: ["df[\"date\"].to_time()", "pd.to_datetime(df[\"date\"])", "df[\"date\"].astype(date)", "pd.datetime(df[\"date\"])"],
    correctIndex: 1,
    citation: "[cite: 3]"
  },
  {
    id: "q6",
    text: "How do you combine two tables side-by-side using a shared column key?",
    options: ["pd.concat()", "df.append()", "df.merge()", "df.join_tables()"],
    correctIndex: 2,
    citation: "[cite: 4]"
  },
  {
    id: "q7",
    text: "Which method is used to group data and calculate aggregates like sum or mean?",
    options: ["df.aggregate()", "df.summarize()", "df.groupby()", "df.pivot()"],
    correctIndex: 2,
    citation: "[cite: 4]"
  },
  {
    id: "q8",
    text: "Which command draws a basic vertical bar chart?",
    options: ["df.plot(kind=\"bar\")", "df.bar_chart()", "plt.draw_bar(df)", "df.graph(\"bar\")"],
    correctIndex: 0,
    citation: "[cite: 5]"
  },
  {
    id: "q9",
    text: "How do you select only the 'Age' column from DataFrame `df`?",
    options: ["df.Age", "df['Age']", "Both A and B", "df.select('Age')"],
    correctIndex: 2,
    citation: "[cite: 6]"
  },
  {
    id: "q10",
    text: "Which function creates a DataFrame from a dictionary?",
    options: ["pd.DataFrame()", "pd.create_df()", "pd.from_dict()", "pd.make_dataframe()"],
    correctIndex: 0,
    citation: "[cite: 1]"
  },
  {
    id: "q11",
    text: "How do you sort a DataFrame by a column named 'Price' in descending order?",
    options: ["df.sort('Price', down=True)", "df.sort_values('Price', ascending=False)", "df.order_by('Price', desc=True)", "df.sort_values('Price', desc=True)"],
    correctIndex: 1,
    citation: "[cite: 3]"
  },
  {
    id: "q12",
    text: "What does `df.describe()` do?",
    options: ["Prints column names", "Provides summary statistics of numeric columns", "Shows the first 10 rows", "Describes the data types"],
    correctIndex: 1,
    citation: "[cite: 2]"
  },
  {
    id: "q13",
    text: "How do you reset the index of a DataFrame?",
    options: ["df.reset_index()", "df.clear_index()", "df.new_index()", "df.drop_index()"],
    correctIndex: 0,
    citation: "[cite: 4]"
  },
  {
    id: "q14",
    text: "Which command reads a CSV file into a DataFrame?",
    options: ["pd.read_csv()", "pd.load_csv()", "pd.open_csv()", "pd.parse_csv()"],
    correctIndex: 0,
    citation: "[cite: 1]"
  }
];

export const getRandomQuestion = (): Question => {
  const randomIndex = Math.floor(Math.random() * QUESTION_BANK.length);
  return QUESTION_BANK[randomIndex];
};
