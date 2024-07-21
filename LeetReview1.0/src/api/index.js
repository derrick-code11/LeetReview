async function fetchAllLeetCodeQuestions() {
  const url = "https://leetcode.com/graphql/";

  const LEETCODE_SESSION = import.meta.env.VITE_LEETCODE_SESSION;
  const csrftoken = import.meta.env.VITE_CSRF_TOKEN;

  const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            topicTags {
              name
              id
              slug
            }
            hasSolution
            hasVideoSolution
          }
        }
      }
    `;

  const batchSize = 100;
  let allQuestions = [];
  let skip = 0;
  let total = Infinity;

  while (skip < total) {
    const variables = {
      categorySlug: "",
      skip: skip,
      limit: batchSize,
      filters: {},
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `LEETCODE_SESSION=${LEETCODE_SESSION}; csrftoken=${csrftoken}`,
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { total: newTotal, questions } = data.data.problemsetQuestionList;

      // getting questions in batches
      total = newTotal;
      allQuestions = allQuestions.concat(questions);
      skip += batchSize;

      console.log(`Fetched ${allQuestions.length} out of ${total} questions`);
    } catch (error) {
      console.error("Error:", error);
      break;
    }
  }

  return allQuestions;
}

// filter questions based on info we need on the frontend
export async function getFilteredLeetcodeQuestions() {
  const allLeetcodeQuestions = await fetchAllLeetCodeQuestions();

  return allLeetcodeQuestions.map((question) => ({
    questionNum: question.frontendQuestionId,
    titleSlug: question.titleSlug,
    title: question.title,
    difficulty: question.difficulty,
    topicTags: question.topicTags.map((tag) => tag.name),
  }));
}
