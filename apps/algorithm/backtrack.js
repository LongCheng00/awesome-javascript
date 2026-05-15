

function permute(nums) {
  const res = []

  function backtrack(path, used) {
    if (path.length === nums.length) {
      res.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) {
        continue
      }
      path.push(nums[i])
      used[i] = true
      backtrack(path, used)
      path.pop()
      used[i] = false
    }

  }
  backtrack([], Array(nums.length).fill(false))
  return res
}

// Example usage:
// const nums = [8, 8, 2, 0, 0]
// const result = permute(nums)
// console.log(result)

function plan(workHours, dayHours, pattern) {
  console.log(workHours, dayHours, pattern)
  const week = []
  let knownSum = 0
  const unkownIndices = []
  for (const i in pattern) {
    let char = pattern[i]
    if (char === '?') {
      week.push(char)
      unkownIndices.push(i)
    } else {
      let hours = parseInt(char)
      week.push(hours)
      knownSum += hours
    }
  }
  if (knownSum > workHours) {
    return []
  }
  if (week.some((day) => typeof (day) == Number && day > dayHours)) {
    return []
  }
  let remain = workHours - knownSum
  let n = unkownIndices.length
  if (remain < 0 || remain > n * dayHours) {
    return []
  }
  console.log(week, knownSum, unkownIndices, remain, n)

  const res = []
  let current = Array(n).fill(0)

  function dfs(idx, rem) {
    let left_pos = n - idx
    if (rem < 0 || rem > left_pos * dayHours) {
      return
    }
    // console.log(`dfs `, idx, rem, left_pos, current)
    if (idx == n) {
      if (rem == 0) {
        const solution = [...week]
        unkownIndices.forEach((pos, i) => {
          solution[pos] = current[i]
        })
        res.push(solution.join(''))
      }
      return
    }

    let minVal = Math.max(0, rem - (left_pos - 1) * dayHours)
    let maxVal = Math.min(rem, dayHours)
    for (let i = minVal; i <= maxVal; i++) {
      current[idx] = i
      dfs(idx + 1, rem - i)
    }

  }

  dfs(0, remain)
  return res
}

// const [workHours, dayHours, pattern] = [44, 8, '??83???']
// const planResult = plan(workHours, dayHours, pattern)
// console.log(planResult)
const [workHours, dayHours, pattern] = [3, 2, '???2???']
const planResult = plan(workHours, dayHours, pattern)
console.log(planResult)