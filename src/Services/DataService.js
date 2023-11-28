class DataService {
    searchHash(hash) {
        return fetch("/api/search/hash?value=" + hash).then(response => response.json());
    }

    searchAddress(address, tab="transactions") {
        if (tab === "info") {
            return fetch("/api/address/info?address=" + address).then(response => response.json());
        }
        else {
            return fetch("/api/address/" + tab + "?address=" + address).then(response => {
                if (response.headers.get("Content-Type") === "application/json") {
                    return response.json();
                }
                else {
                    return response.blob();
                }
            });
        }
    }

    searchEpoch(epoch) {
        return fetch("/api/search/epoch?value=" + epoch).then(response => response.json());
    }

    getBlockchain(page = 1) {
        return fetch("/api/network/blockchain?page=" + page)
            .then(response => {
                return response.json().then(json_response => [response.headers, json_response]);
            });
    }

    getReputation() {
        return fetch("/api/network/reputation").then(response => response.json());
    }

    getBalances(page = 1) {
        return fetch("/api/network/balances?page=" + page)
            .then(response => {
                return response.json().then(json_response => [response.headers, json_response]);
            });
    }

    getHome() {
        return fetch("/api/home").then(response => response.json());
    }

    getMempool(transaction_type) {
        return fetch("/api/network/mempool?transaction_type=" + transaction_type).then(response => response.json());
    }

    getNetwork(key, start_epoch, stop_epoch) {
        if (start_epoch !== null && stop_epoch !== null)
            return fetch("/api/network?/statisticskey=" + key + "&start-epoch=" + start_epoch + "&stop-epoch=" + stop_epoch).then(response => response.json());
        else if (start_epoch !== null)
            return fetch("/api/network/statistics?key=" + key + "&start-epoch=" + start_epoch).then(response => response.json());
        else if (stop_epoch !== null)
            return fetch("/api/network/statistics?key=" + key + "&stop-epoch=" + stop_epoch).then(response => response.json());
        else
            return fetch("/api/network/statistics?key=" + key).then(response => response.json());
    }

    getTapi() {
        return fetch("/api/network/tapi").then(response => response.json());
    }
}

export default new DataService();
