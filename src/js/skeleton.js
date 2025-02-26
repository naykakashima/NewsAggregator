export function createSkeletonCard() {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-card bg-gray-300 animate-pulse h-40 rounded-2xl";
    return skeleton;
}

export function showSkeletons(container, count) {
    for (let i = 0; i < count; i++) {
        container.appendChild(createSkeletonCard());
    }
}

export function removeSkeletons() {
    document.querySelectorAll(".skeleton-card").forEach(skeleton => skeleton.remove());
}