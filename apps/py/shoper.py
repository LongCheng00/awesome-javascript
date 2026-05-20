import sys
import heapq

def solve() -> None:
  data = sys.stdin.read().strip().split()
  if not data:
    return
  it = iter(data)
  n = int(next(it))
  distances = [int(next(it)) for _ in range(n)]
  gallons = [int(next(it)) for _ in range(n)]
  d = int(next(it))
  k = int(next(it))
  
  stations = sorted(zip(distances,gallons))
  
  heap = []
  current_fuel = k
  stops = 0
  idx = 0
  
  while current_fuel < d:
    while idx < n and stations[idx][0] <= current_fuel:
      heapq.heappush(heap,-stations[idx][1])
      idx += 1
    
    if not heap:
      print(-1)
      return
    
    best_fuel = -heapq.heappop(heap)
    current_fuel += best_fuel
    stops += 1
    
  print(stops)
  
if __name__ == '__main__':
  solve()