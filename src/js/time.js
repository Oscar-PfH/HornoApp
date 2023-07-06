export const getHoursList = () => {
    let hours = [];
    for (let i = 1; i <= 12; i++) {
        if (i < 10) hours.push('0' + i);
        else hours.push(i.toString());
    }
    return hours;
}

export const getMinutesList = () => {
    let minutes = [];
        for (let i = 0; i <= 59; i++) {
            if (i < 10) minutes.push('0' + i);
            else minutes.push(i.toString());
        }
    return minutes;
}

export const getHourIndex = (hour) => {
    if (hour > 12) return hour - 13;
    if (hour === 0) return 11;
    return hour - 1;
}

export const getTimeText = (time) => {
    let timeText = '';
    let hours = parseInt(time.split(':')[0]);
    let minutes = parseInt(time.split(':')[1]);
    if (hours > 12) {
        hours -= 12;
        timeText += hours.toString() + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' pm';
    }
    else if (hours === 12) {
        timeText += '12:' + (minutes < 10 ? '0' + minutes : minutes) + ' pm';
    }
    else if (hours === 0) {
        timeText += '12:' + (minutes < 10 ? '0' + minutes : minutes) + ' am';
    }
    else {
        timeText += hours.toString() + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' am';
    }
    return timeText;
}

export const getTime = (time, input, value) => {
    let new_time = '';
    if (input === 'hour') {
        new_time += value + ':' + time[1];
    }
    else if (input === 'minute') {
        new_time += time[0] + ':' + value;
    }
    else if (input === 'ampm') {
        if (value === 'PM' && parseInt(time[0]) < 12) {
            new_time += (parseInt(time[0]) + 12).toString() + ':' + time[1];
        }
        else if (value === 'AM' && parseInt(time[0]) === 12) {
            new_time += '00' + ':' + time[1];
        }
        else if (value === 'AM' && parseInt(time[0]) > 12) {
            new_time += (parseInt(time[0]) - 12).toString() + ':' + time[1];
        }
        else {
            new_time += time[0] + ':' + time[1];
        }
    }
    else {
        new_time += time[0] + ':' + time[1];
    }
    return new_time;
}