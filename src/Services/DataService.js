class DataService {
    searchHash(hash, page=1, simple=false) {
        return fetch("/api/search/hash?value=" + hash + "&page=" + page + "&simple=" + simple)
            .then(response => {
                return response.json().then(json_response => [response.headers, json_response]);
            });
    }

    searchAddress(address, tab = "transactions", page = 1) {
        if (tab === "details") {
            return fetch("/api/address/details?address=" + address)
                .then(response => {
                    return response.json()
                });
        }
        else if (tab === "info") {
            return fetch("/api/address/info?addresses=" + address)
                .then(response => {
                    return response.json()
                });
        }
        else {
            return fetch("/api/address/" + tab + "?address=" + address + "&page=" + page)
                .then(response => {
                    return response.json().then(json_response => [response.headers, json_response]);
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
