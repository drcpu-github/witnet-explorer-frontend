class TimeConverter {
    convertUnixTimestamp(unix_timestamp, type="full") {
        if (unix_timestamp === 0) {
            return ""
        }

        var date = new Date(unix_timestamp * 1000);

        var hours = String(date.getHours()).padStart(2, "0");
        var minutes = String(date.getMinutes()).padStart(2, "0");
        var seconds = String(date.getSeconds()).padStart(2, "0");

        var day = String(date.getDate()).padStart(2, "0");
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var year = date.getFullYear();

        if (type === "full") {
            return hours + ':' + minutes + ':' + seconds + " " + day + "/" + month + "/" + year;
        }
        else if (type === "hour") {
            return hours + ':' + minutes + ':' + seconds;
        }
        else if (type === "day") {
            return day + "/" + month + "/" + year;
        }
    }
}

export default new TimeConverter();