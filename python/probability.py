from random import random

def betAnalyzer(num_trials, payout, p_w):
    money = 0
    for i in range(1, num_trials):
        money -= 1
        if random() < p_w: money += 1 + payout
    return money
