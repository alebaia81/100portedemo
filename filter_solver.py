import sys
import math

class Color:
    def __init__(self, r, g, b):
        self.r = r
        self.g = g
        self.b = b

# Simple approach: instead of full solver, we can just print instructions or use a known close filter.
# Actually, I can just write a short python script that uses a known hex-to-filter library if available, 
# but it's not installed.
# Let's just use CSS drop-shadow trick!
