class DataService {
    searchHash(hash) {
        return fetch("/api/hash?value=" + hash).then(response => response.json());
    }

    searchAddress(address, tab="transactions") {
        return fetch("/api/address?value=" + address + "&tab=" + tab).then(response => {
            if (response.headers.get("Content-Type") === "application/json") {
                return response.json();
            }
            else {
                return response.blob();
            }
        });
    }

    searchEpoch(epoch) {
        return fetch("/api/epoch?value=" + epoch).then(response => response.json());
    }

    getBlockchain(action="init", block=-1) {
        var fetch_str = "/api/blockchain?action=" + action
        if (block !== -1) {
            fetch_str += "&block=" + block
        }
        return fetch(fetch_str).then(response => response.json());
    }

    getReputation(epoch) {
        if (epoch === "") {
            return fetch("/api/reputation").then(response => response.json());
        }
        else {
            return fetch("/api/reputation?epoch=" + epoch).then(response => response.json());
        }
    }

    getBalances(start, stop) {
        return fetch("/api/balances?start=" + start + "&stop=" + stop).then(response => response.json());
    }

    getHome() {
        return fetch("/api/home").then(response => response.json());
    }

    getMempool() {
        return fetch("/api/mempool?key=history").then(response => response.json());
    }

    getNetwork(key, start_epoch, stop_epoch) {
        if (start_epoch !== null && stop_epoch !== null)
            return fetch("/api/network?key=" + key + "&start-epoch=" + start_epoch + "&stop-epoch=" + stop_epoch).then(response => response.json());
        else if (start_epoch !== null)
            return fetch("/api/network?key=" + key + "&start-epoch=" + start_epoch).then(response => response.json());
        else if (stop_epoch !== null)
            return fetch("/api/network?key=" + key + "&stop-epoch=" + stop_epoch).then(response => response.json());
        else
            return fetch("/api/network?key=" + key).then(response => response.json());
    }

    getTapi() {
        return fetch("/api/tapi").then(response => response.json());
    }
}

export default new DataService();
