const NEWS_API_KEY = "b4a1ee2e6ff44e129773a16ed882b5da";
const GUARDIAN_API_KEY = "3f47c8d1-a80f-4ec2-b620-1f3de6e38f73";
const NYT_API_KEY = "GcMCBCXSt75j0s3I8MzKs9zdtbGUHyTI";

// API URLs
const NEWS_API = `https://newsapi.org/v2/everything?q=apple&from=2025-02-25&to=2025-02-25&sortBy=popularity&apiKey=${NEWS_API_KEY}`;
const GUARDIAN_API = `https://content.guardianapis.com/search?show-fields=all&api-key=${GUARDIAN_API_KEY}`;
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
                    console.log(data)

                    // Tag articles with the API source
                    if (index === 0 && data.articles) {
                        data.articles.forEach(article => article.source_id = "newsapi");
                    } else if (index === 1 && data.response.results) {
                        data.response.results.forEach(article => article.source_id = "guardian");
                        //published has the dates
                    } else if (index === 2 && data.results) {
                        data.results.forEach(article => article.source_id = "nyt");
                        //byline stores author 
                        //created_date store date created
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


