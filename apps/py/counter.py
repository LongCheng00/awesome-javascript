from collections import Counter

def count_pairs_and_remaining(message):
    freq = Counter(message)
    pairs = 0
    remaining = 0
    
    for count in freq.values():
        pairs += count // 2
        remaining += count % 2
    
    return pairs, remaining

if __name__ == "__main__":
    message_size = int(input().strip())
    message = list(map(int, input().strip().split()))
    
    pairs, remaining = count_pairs_and_remaining(message)
    print(pairs, remaining)