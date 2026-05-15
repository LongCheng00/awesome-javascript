function getTimes(arrival, direction) {
  const n = arrival.length
  const events = arrival.map((time, i) => [time, direction[i], i])
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1])

  let currentTime = 0
  let lastDirection = -1
  const result = Array(n)
  const waiting = []
  let eventIndex = 0

  while (eventIndex < n || waiting.length > 0) {
    while (eventIndex < n && events[eventIndex][0] <= currentTime) {
      waiting.push(events[eventIndex])
      eventIndex++
    }

    if (waiting.length === 0) {
      currentTime = events[eventIndex][0]
      continue
    }

    const minArrival = Math.min(...waiting.map(e => e[0]))
    const candiates = waiting.filter(e => e[0] === minArrival)

    let selectedPerson = null
    if (lastDirection === -1) {
      selectedPerson = candiates.reduce((min, cur) =>
        cur[2] < min[2] ? cur : min)

    } else {
      const sameDirCandiates = candiates.filter(e => e[1] === lastDirection)
      if (sameDirCandiates.length > 0) {
        selectedPerson = sameDirCandiates.reduce((min, cur) =>
          cur[2] < min[2] ? cur : min)
      } else {
        selectedPerson = candiates.reduce((min, cur) =>
          cur[2] < min[2] ? cur : min)
      }
    }

    const selectedIndex = waiting.findIndex(
      e => e[2] === selectedPerson[2])
    waiting.splice(selectedIndex, 1)

    result[selectedPerson[2]] = currentTime
    lastDirection = selectedPerson[1]
    currentTime++
  }
  return result
}

console.log(getTimes([0, 0], [0, 1]))//0,1
console.log(getTimes([0, 0], [1, 0]))//0,1
console.log(getTimes([0, 0, 0], [0, 1, 0]))//0,2,1
console.log(getTimes([3, 0, 0], [0, 1, 0]))//3,0,1 
console.log(getTimes([1, 1, 3], [0, 1, 0]))//1,2,3