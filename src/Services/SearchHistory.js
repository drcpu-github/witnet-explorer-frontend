class SearchHistory {
    getHistory() {
        return JSON.parse(localStorage.getItem("search-history") || "[]").reverse()
    }

    addToHistory(item) {
        var history = JSON.parse(localStorage.getItem("search-history") || "[]")
        if (history.includes(item)) {
            const index = history.indexOf(item);
            history.splice(index, 1);
            history.push(item);
        }
        else {
            history.push(item);
            if (history.length > 25) {
                history.splice(0, 1);
            }
        }
        console.log(history);
        localStorage.setItem("search-history", JSON.stringify(history));
    }

    resetHistory() {
        localStorage.setItem("search-history", JSON.stringify([]));
    }
}

export default new SearchHistory();
