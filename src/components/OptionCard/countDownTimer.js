import React, { useState, useRef, useEffect } from "react";

const CountdownTimer = ({date}) => {
    const [ timerDays,setTimerDays ] = useState('00');
    const [ timerHours,setTimerHours ] = useState('00');
    const [ timerMinutes,setTimerMinutes ] = useState('00');
    const [ timerSeconds,setTimerSeconds ] = useState('00');
    let interval = useRef();
    const setTimer = () =>{
        const countdownDate = date.getTime();
        interval = setInterval(() => {
            function formatTime(time){
                return time<10 ? `0${time}` : time;
              }
        const now = new Date().getTime();
        const distance = countdownDate - now ;
        const days =  formatTime(Math.floor(distance / (1000 * 60 * 60 *24))) ;
        const hours =  formatTime(Math.floor((distance % (1000 * 60 * 60 *24) / (1000 * 60 * 60)))) ;
        const minutes =  formatTime(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))) ;
        const seconds =  formatTime(Math.floor((distance % (1000 * 60)) / 1000)) ;
        if(distance < 0){
            // Stop the timer
            clearInterval(interval.current);    
        }else{
            //update timer
            setTimerDays(days);
            setTimerHours(hours);
            setTimerMinutes(minutes);
            setTimerSeconds(seconds);
        }
    }, 1000); 
}
    useEffect(()=> {
        setTimer();
        return () => {
            clearInterval(interval.current);
        };
    })   
    return(
        <div>
            {`${timerDays}:${timerHours}:${timerMinutes}:${timerSeconds}` }
        </div>
    )
    
}   
    

export default CountdownTimer;