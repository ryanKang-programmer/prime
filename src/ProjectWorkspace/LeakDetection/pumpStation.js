const getPump = (h) => {
    let curPump;
    if (h === 0) {
        curPump = [0, 1]
    }
    else if (h <= 1350) {
        curPump = [0, 1]
    }
    else if (h <= 2580) {
        curPump = [1, 2]
    }
    else if (h <= 2850) {
        curPump = [2, 3]
    }
    else if (h <= 3390) {
        curPump = [3, 4]
    }
    else if (h <= 4560) {
        curPump = [4, 5]
    }
    else if (h <= 7016) {
        curPump = [5, 6]
    }
    else if (h <= 8005) {
        curPump = [6, 7]
    } else {
        curPump = null;
    }
    return curPump;
}

export default getPump;