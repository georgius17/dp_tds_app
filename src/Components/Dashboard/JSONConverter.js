


export const JSONConverter = (file) => {
    let output = [];

    let GPS_temp = '';
    let TEMP_temp = 0;
    let TDS_temp = 0;
    let DATE_temp = '';
    const numbers = '01234567890.'

    for (let i = 0; i < file.length; i++) {
        if (file[i] === 'G' && file[i+1] === 'P') {
            GPS_temp = file.slice(i+5, i+35);
            TEMP_temp = file.slice(i+42, i+50);

            let index = 0;
            for (let j = 0; j < 20; j++) {
                
                if (numbers.includes(file[i+55+j])) {
                    index = i+55+j;
                } else break;
            }
            TDS_temp = file.slice(i+55, index+1);
            DATE_temp = file.slice(index+11, index+30);

            output.push({
                GPS: GPS_temp,
                TEMP: TEMP_temp,
                TDS: TDS_temp,
                DATE: DATE_temp
            });
        }
    }

    console.log(output);
    return output

}

//[{GPS:[306.201019,279.651031,674.400024],temp:23.125000,tds:0.000000,datetime:08-03-2021_08-52-35},{GPS