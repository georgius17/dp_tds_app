//Arduino saves data every 5s

export const TimeGenerator = (length) => {
    let time_values = [0];
    for (let i = 0; i < length; i++) {
        time_values.push(time_values[i]+5);
    }
    return time_values;
}