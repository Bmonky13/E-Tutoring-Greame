//Timer
if (time !== null) {
  time.innerHTML = toTime(timeNum)
  setInterval(function () {
    if (username !== null) {
      timeNum++
      elapsed++
    }
    time.innerHTML = toTime(timeNum)
  }, 1000)
}