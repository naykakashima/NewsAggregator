import { fetchNews } from "./apiService.js";
import { createNewsCard } from "./newsCard.js";
import { showSkeletons, removeSkeletons } from "./skeleton.js";

const container = document.getElementById("newsContainer");
const sourceFilter = document.getElementById("sourceFilter");
const sortByDate = document.getElementById("sortByDate");

let allArticles = []; // Store all articles globally

// 📰 Load and render news
async function loadNews() {
    container.innerHTML = "";
    showSkeletons(container, 6); // Show placeholders

    const [newsAPI, guardianAPI, nytAPI] = await fetchNews();
    allArticles = [
        ...(newsAPI?.articles || []),
        ...(guardianAPI?.results || []),
        ...(nytAPI?.results || [])
    ];

    removeSkeletons();

    if (allArticles.length === 0) {
        container.innerHTML = "<p class='text-danger'>No news available.</p>";
    } else {
        renderArticles(allArticles);
    }
}

// 🛠 Render filtered/sorted articles
function renderArticles(articles) {
    container.innerHTML = "";
    if (articles.length === 0) {
        container.innerHTML = "<p class='text-danger'>No matching articles found.</p>";
        return;
    }
    articles.forEach(article => {
        container.appendChild(createNewsCard(article));
    });
}

// 🏷️ Filter articles by source
function filterArticlesBySource() {
    const selectedSource = sourceFilter.value;
    let filteredArticles = allArticles;

    if (selectedSource && selectedSource !== "all") {
        filteredArticles = allArticles.filter(article => article.source_id === selectedSource);
    }

    sortAndRender(filteredArticles);
}

// 🕒 Sort articles by date
function sortArticlesByDate(articles) {
    const sortOrder = sortByDate.value;

    return articles.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.webPublicationDate || a.created_date);
        const dateB = new Date(b.publishedAt || b.webPublicationDate || b.created_date);

        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
}

// 🔧 Combine filtering and sorting
function sortAndRender(filteredArticles) {
    const sortedArticles = sortArticlesByDate(filteredArticles);
    renderArticles(sortedArticles);
}

// 🔔 Event Listeners
sourceFilter.addEventListener("change", filterArticlesBySource);
sortByDate.addEventListener("change", () => filterArticlesBySource());
document.getElementById("retryButton").addEventListener("click", loadNews);

loadNews();
