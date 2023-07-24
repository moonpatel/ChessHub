import { useEffect, useState } from 'react'

const useCountDown = (timeLimit, isTimerOn) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60 * 1000);

    useEffect(() => {
        if (!isTimerOn) {
            return;
        }
        if (timeLeft > 0) {
            const interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1000);
            }, 1000);

            return () => {
                clearInterval(interval)
            }
        }
    }, [timeLeft]);

    return getFormattedTime(timeLeft)
}

function getFormattedTime(time) {
    let minutes = Math.floor(time / (1000 * 60));
    let seconds = Math.floor(time / (1000)) % 60;

    return [seconds, minutes];
}

export default useCountDown