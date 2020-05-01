import React from 'react';
import { Button } from '@zendeskgarden/react-buttons';
import { resetWarningCache } from 'prop-types';

const Timer = ({
  finishTime,
  start,
  clear
}) => {
  if(finishTime === undefined) { return null; }
  if(window.timerInterval) {
    clearInterval(window.timerInterval);
    window.timerInterval = null;
  }
// Update the count down every 1 second
  window.timerInterval = setInterval(function() {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = finishTime - now;

  // Time calculations for days, hours, minutes and seconds
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("timer").innerHTML = (minutes) + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(window.timerInterval);
    document.getElementById("timer").innerHTML = 'TIMER FINISHED';
  }
}, 1000);

var reset = () => {
  clearInterval(window.timerInterval);
  document.getElementById("timer").innerHTML = 'TIMER FINISHED';
};

  return (
    <div>
      <div id='timer' style={{fontSize: '25px', textAlign: 'center', marginTop: '15px'}}></div>
      <Button onClick={start}>Start Timer</Button>
      <Button onClick={() => { clear(); reset() }}>Clear Timer</Button>
    </div>
  );
};

export default Timer;
