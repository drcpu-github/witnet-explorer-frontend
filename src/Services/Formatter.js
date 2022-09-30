class Formatter {
    formatValue(value) {
        return value.toLocaleString();
    }

    formatValueRound(value, decimals) {
        var rounded_value = Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
        return rounded_value.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    // This function will reduce the number of decimal digits for every magnitude
    // For example:
    //    x digits when value is smaller than 10
    //    x - 1 digits if the value is between 10 and 100
    //    x - 2 digits if the value is between 100 and 1000
    formatValueReducingDecimals(value, decimals) {
        for (var i = 0; i < decimals; i++) {
            if (value < Math.pow(10, i + 1)) {
                var rounded_value = Math.round((value + Number.EPSILON) * Math.pow(10, decimals - i)) / Math.pow(10, decimals - i);
                return rounded_value.toLocaleString(undefined, {
                    minimumFractionDigits: decimals - i,
                    maximumFractionDigits: decimals - i
                });
            }
        }
        return Math.round(value).toLocaleString();
    }

    formatValueSuffix(value, decimals) {
        if (value > 1E9) {
            var billions = value / 1E9;
            return this.formatValueRound(billions, decimals) + "B";
        }
        else if (value > 1E6) {
            var millions = value / 1E6;
            return this.formatValueRound(millions, decimals) + "M";
        }
        else if (value > 1E3) {
            var thousands = value / 1E3;
            return this.formatValueRound(thousands, decimals) + "K";
        }
        else {
            return value;
        }
    }

    formatWitValue(value, decimals) {
        if (value < 1000) {
            return value.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }) + " nWIT";
        }
        else if (value < 1000000){
            return (Math.floor(value / 10) / 100).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
              }) + " uWIT";
        }
        else if (value < 1000000000){
            return (Math.floor(value / 10000) / 100).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
              }) + " mWIT";
        }
        else {
            return (Math.floor(value / 10000000) / 100).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
              }) + " WIT";
        }
    }
}

export default new Formatter();