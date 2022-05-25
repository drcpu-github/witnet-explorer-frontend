class DataService {
    searchHash(hash) {
        return fetch("/api/hash?value=" + hash).then(response => response.json());
    }

    searchAddress(address, tab="transactions") {
        return fetch("/api/address?value=" + address + "&tab=" + tab).then(response => response.json());
    }

    getBlockchain(action="init", block=-1) {
        var fetch_str = "/api/blockchain?action=" + action
        if (block !== -1) {
            fetch_str += "&block=" + block
        }
        return fetch(fetch_str).then(response => response.json());
    }

    getReputation() {
        return fetch("/api/reputation").then(response => response.json());
    }

    getBalances(start, stop) {
        return fetch("/api/balances?start=" + start + "&stop=" + stop).then(response => response.json());
    }

    getHome() {
        return fetch("/api/home").then(response => response.json());
    }

    getPendingTransactions() {
        return fetch("/api/pending").then(response => response.json());
    }

    getNetwork() {
        return fetch("/api/network").then(response => response.json());
    }

    initTapi() {
        return fetch("/api/tapi?action=init").then(response => response.json());
    }

    updateTapi() {
        return fetch("/api/tapi?action=update").then(response => response.json());
    }
}

export default new DataService();
