# Deque

Because I can't spell dequeue right.

> *This is still very experimental, I don't recommend using it.*

This project tries to implement a dynamic "circular" dequeue based on [this](https://www.dre.vanderbilt.edu/~schmidt/PDF/work-stealing-dequeue.pdf).

Currently, the only advantage over JavaScript's array `.push()`, `.shift()`, `.unshift()` and `.pop()` is the performance.
Except `.unshift()`, it is not implemented yet.

This is because I have not implemented the Circular Array that avoids copying an array.