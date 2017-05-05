export function ToInteger(num) {
    if(typeof num !== "number") num = Number(num);
    if(Number.isNaN(num)) num = 0;
    return Math.trunc(num);
}