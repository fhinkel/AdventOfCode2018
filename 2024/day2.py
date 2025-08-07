import asyncio

async def read_input():
    with open('./input.txt', 'r') as f:
        res = f.read().strip().split('\n')
        res = [list(map(int, line.split())) for line in res]
    return res

def is_increasing(arr):
    for i in range(1, len(arr)):
        if arr[i] <= arr[i-1]:
            return False
        dist = arr[i] - arr[i-1]
        if dist > 3:
            return False
    return True

def is_decreasing(arr):
    for i in range(1, len(arr)):
        if arr[i] >= arr[i-1]:
            return False
        dist = arr[i-1] - arr[i]
        if dist > 3:
            return False
    return True

def combinations(arr):
    combs = []
    for i in range(len(arr)):
        comb = arr[:i] + arr[i+1:]
        combs.append(comb)
    return combs

async def find_safe_reports(inputs):
    count = 0
    for report in inputs:
        if is_decreasing(report) or is_increasing(report):
            count += 1
        else:
            combs = combinations(report)
            for comb in combs:
                if is_decreasing(comb) or is_increasing(comb):
                    count += 1
                    break
    return count

async def main():
    inputs = await read_input()
    sum_val = await find_safe_reports(inputs)
    print(sum_val)
    print("done")

if __name__ == "__main__":
    asyncio.run(main())
