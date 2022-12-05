/**
 * --- Part Two ---
As you watch the crane operator expertly rearrange the crates, you notice the process isn't following your prediction.

Some mud was covering the writing on the side of the crane, and you quickly wipe it away. The crane isn't a CrateMover 9000 - it's a CrateMover 9001.

The CrateMover 9001 is notable for many new and exciting features: air conditioning, leather seats, an extra cup holder, and the ability to pick up and move multiple crates at once.

Again considering the example above, the crates begin in the same configuration:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 
Moving a single crate from stack 2 to stack 1 behaves the same as before:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 
However, the action of moving three crates from stack 1 to stack 3 means that those three moved crates stay in the same order, resulting in this new configuration:

        [D]
        [N]
    [C] [Z]
    [M] [P]
 1   2   3
Next, as both crates are moved from stack 2 to stack 1, they retain their order as well:

        [D]
        [N]
[C]     [Z]
[M]     [P]
 1   2   3
Finally, a single crate is still moved from stack 1 to stack 2, but now it's crate C that gets moved:

        [D]
        [N]
        [Z]
[M] [C] [P]
 1   2   3
In this example, the CrateMover 9001 has put the crates in a totally different order: MCD.

Before the rearrangement process finishes, update your simulation so that the Elves know where they should stand to be ready to unload the final supplies. After the rearrangement procedure completes, what crate ends up on top of each stack?
 */

const fs = require('fs');
const input = fs.readFileSync('./input.txt').toString().split('\n');

let stacks = new Map();
const stackNumbers = input.slice(8, 9)[0].split('');
const isChar = new RegExp('[A-Z]');
const containers = input.slice(0, 8);
const instructions = input.splice(10, input.length - 1);

const doTheDamnThing = () => {
  let resultStr = new Array();

  // Build the stacks
  containers.forEach((container) => {
    container.split('').forEach((name, idx) => {
      if (isChar.test(name)) {
        if (stacks.has(stackNumbers[idx])) {
          let currentStack = stacks.get(stackNumbers[idx]);
          currentStack.unshift(name);
          stacks.set(stackNumbers[idx], currentStack);
        } else {
          let currentStack = new Array(name);
          stacks.set(stackNumbers[idx], currentStack);
        }
      }
    });
  });

  // Parse and execute instructions
  instructions.forEach((instruction) => {
    const [, numToMove, , from, , dest] = instruction.split(' ');
    const removedStack = stacks.get(from).splice(-numToMove);

    if (stacks.has(dest)) {
      const destStack = stacks.get(dest);
      removedStack.forEach((box) => {
        destStack.push(box);
      });
      stacks.set(destStack);
    } else {
      stacks.set(dest, removedStack);
    }
  });

  // Print answer
  for (let i = 1; i < stacks.size + 1; i++) {
    if (stacks.has(i.toString())) {
      resultStr.push(stacks.get(i.toString()).pop());
    }
  }

  console.log(resultStr.join(''));
};

// Answer: QNDWLMGNS
doTheDamnThing();
