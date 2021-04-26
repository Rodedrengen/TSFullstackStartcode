const date:Date = new Date();
const date1:Date = new Date(2020, 0O5, 0O17, 20, 43, 0O0, 0O0);  
const dif:number = date.valueOf() - date1.valueOf()

function msToTime(duration:number) {
    
    //const milliseconds:Number = Math.floor((duration % 1000) / 100)
    const seconds:number = Math.floor((duration / 1000) % 60)
    const minutes:number = Math.floor((duration / (1000 * 60)) % 60)
    const hours:number = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hourss = (hours < 10) ? "0" + hours : hours;
    const minutess = (minutes < 10) ? "0" + minutes : minutes;
    const secondss = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

console.log(msToTime(dif))