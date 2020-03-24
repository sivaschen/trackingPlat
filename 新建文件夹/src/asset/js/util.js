var tool = function () {
    function formatTimestamp(time) {
        let rawTimeStr = new Date(time *1000);
        let year = rawTimeStr.getFullYear();
        let month = rawTimeStr.getMonth() + 1;
        month = month >= 10 ? month : "0" + month;
        let date = rawTimeStr.getDate();
        date = date >= 10 ? date : "0" + date;
        let hour = rawTimeStr.getHours();
        hour = hour >= 10 ? hour : "0" + hour;
        let minute = rawTimeStr.getMinutes();
        minute = minute >= 10 ? minute : "0" + minute;
        let second = rawTimeStr.getSeconds();
        second = second >= 10 ? second : "0" + second;

        return year + "/" + month + '/' + date + ' ' + hour + ':' + minute + ':' + second;
    }

    return {
        formatTimestamp: formatTimestamp
    }
}()



export default tool