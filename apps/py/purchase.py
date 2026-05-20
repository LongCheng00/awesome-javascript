import sys

def main() -> None:
  data = sys.stdin.read().strip().split()
  if not data:
    return
  it = iter(data)
  n = int(next(it))
  m = int(next(it))
  
  first_products = [int(next(it)) for _ in range(m)]
  common = set(first_products)
  
  for _ in range(n - 1):
    cur_products = [int(next(it)) for _ in range(m)]
    common &= set(cur_products)
    if not common:
      break
    
  if common:
    result = sorted(common)
    print(' '.join(map(str, result)))
  else:
    print('NA')
    
if __name__ == '__main__':
  print('starting...')
  main()
