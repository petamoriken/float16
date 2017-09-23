export function ToInteger(num) {
    if(typeof num !== "number") num = Number(num);
    if(Number.isNaN(num)) num = 0;
    return Math.trunc(num);
}

export function defaultCompareFunction(x, y) {
    const [isNaN_x, isNaN_y] = [Number.isNaN(x), Number.isNaN(y)];

    if(isNaN_x && isNaN_y)
        return 0;

    if(isNaN_x)
        return 1;

    if(isNaN_y)
        return -1;

    if(x < y)
        return -1;

    if(x > y)
        return 1;

    if(x === 0 && y === 0) {
        const [isPlusZero_x, isPlusZero_y] = [Object.is(x, 0), Object.is(y, 0)];

        if(!isPlusZero_x && isPlusZero_y)
            return -1;

        if(isPlusZero_x && !isPlusZero_y)
            return 1;
    }

    return 0;
}