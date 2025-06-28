const NEWS_API_KEY = "${process.env.NEWS_API}"; // Replace with your actual News API key or use an environment variable
const GUARDIAN_API_KEY = "${process.env.GUARDIAN_API}"; // Replace with your actual Guardian API key or use an environment variable
const NYT_API_KEY = "${process.env.NYT_API}"; // Replace with your actual NYT API key or use an environment variable

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


