class TimeConverter {
    convertUnixTimestamp(unix_timestamp, type="full") {
        if (unix_timestamp === 0) {
            return ""
        }

        var date = new Date(unix_timestamp * 1000);

        var hours = "0" + date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var day = "0" + date.getDate();
        var month = "0" + (date.getMonth() + 1);
        var year = date.getFullYear();

        if (type === "full") {
            return hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + " " + day.substr(-2) + "/" + month.substr(-2) + "/" + year;
        }
        else if (type === "hour") {
            return hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        }
        else if (type === "day") {
            return day.substr(-2) + "/" + month.substr(-2) + "/" + year;
        }
    }
}

export default new TimeConverter();