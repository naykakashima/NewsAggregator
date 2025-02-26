const NEWS_API_KEY = "v3rKoVXqC2qFPlCrKL9HemfESnPoUrqh0I0MbgOn";
const GUARDIAN_API_KEY = "3f47c8d1-a80f-4ec2-b620-1f3de6e38f73";
const NYT_API_KEY = "GcMCBCXSt75j0s3I8MzKs9zdtbGUHyTI";

// API URLs
const NEWS_API = `https://api.thenewsapi.com/v1/news/top?api_token=${NEWS_API_KEY}`;
const GUARDIAN_API = `https://content.guardianapis.com/search?show-fields=thumbnail&api-key=${GUARDIAN_API_KEY}`;
const NYT_API = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${NYT_API_KEY}`;

export async function fetchNews() {
    try {
        const responses = await Promise.allSettled([
            fetch(NEWS_API),
            fetch(GUARDIAN_API),
            fetch(NYT_API)
        ]);

        const results = await Promise.all(
            responses.map(async (res, index) => {
                if (res.status === "fulfilled" && res.value.ok) {
                    const data = await res.value.json();

                    // Tag articles with the API source
                    if (index === 0 && data.articles) {
                        data.articles.forEach(article => article.source_id = "newsapi");
                    } else if (index === 1 && data.results) {
                        data.results.forEach(article => article.source_id = "guardian");
                    } else if (index === 2 && data.results) {
                        data.results.forEach(article => article.source_id = "nyt");
                    }

                    return data;
                } else {
                    console.warn(`API ${index + 1} failed.`);
                    return null;
                }
            })
        );

        return results;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}


