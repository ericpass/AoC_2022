/**
 * --- Day 7: No Space Left On Device ---
You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

$ system-update --please --pretty-please-with-sugar-on-top
Error: No space left on device
Perhaps you can delete some files to make space for the update?

You browse around the filesystem to assess the situation and save the resulting terminal output (your puzzle input). For example:

$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files). The outermost directory is called /. You can navigate around the filesystem, moving into or out of directories and listing the contents of the directory you're currently in.

Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:

cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:
cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
cd / switches the current directory to the outermost directory, /.
ls means list. It prints out all of the files and directories immediately contained by the current directory:
123 abc means that the current directory contains a file named abc with size 123.
dir xyz means that the current directory contains a directory named xyz.
Given the commands and output in the example above, you can determine that the filesystem looks visually like this:

- / (dir)
  - a (dir)
    - e (dir)
      - i (file, size=584)
    - f (file, size=29116)
    - g (file, size=2557)
    - h.lst (file, size=62596)
  - b.txt (file, size=14848514)
  - c.dat (file, size=8504156)
  - d (dir)
    - j (file, size=4060174)
    - d.log (file, size=8033020)
    - d.ext (file, size=5626152)
    - k (file, size=7214296)

Here, there are four directories: / (the outermost directory), a and d (which are in /), and e (which is in a). These directories also contain files of various sizes.

Since the disk is full, your first step should probably be to find directories that are good candidates for deletion. To do this, you need to determine the total size of each directory. The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly. (Directories themselves do not count as having any intrinsic size.)

The total sizes of the directories above can be found as follows:

The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
Directory d has total size 24933642.
As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.
To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)

Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?
 */

const fs = require('fs');
const input = fs.readFileSync('./input.txt').toString().split('\n');

// const testInput =
//   '$ cd /\n$ ls\ndir fts\ndir jnwr\ndir lrvl\ndir nzgprvw\ndir snwqjgj\n16394 tllvcdr.sjl\n195891 zbdp.gqb\ndir zddrb\n$ cd fts\n$ ls\ndir dlqtffw\n$ cd dlqtffw\n$ ls\n73533 nqbvg.fgd\n$ cd ..'.split(
//     '\n'
//   );

const testInput = '$ cd /\ndir a\n$ cd a\ndir e\n$ cd e\n584 i.txt\n$ cd ..\n29116 f.txt\n2557 g.txt\n62596 h.txt\n$ cd ..\n14848514 b.txt\n8504156 c.txt\ndir d\n$ cd d\n4060174 j.txt\n8033020 d.log\n5626152 d.ext\n7214296 k.txt'.split('\n');

const dirTree = new Map();
dirTree.set('/', { children: [], sum: 0 });
const cdCommand = '$ cd';
const dirCommand = 'dir';
const MAX_SIZE = 100000;
let result = 0;
let currentDir = ['/'];
let dirStack = ['/'];

// Parse input and build the tree
const parseCommand = (command) => {
  // Parse cd commands
  if (command.indexOf(cdCommand) !== -1) {
    // console.log(`Command: ${command}`);
    const targetDir = command.split(' ')[2];
    if (targetDir === '..') {
      dirStack.pop();
      // console.log('Going back!')
    } else if (targetDir !== '/') {
      dirStack.push(targetDir);
      dirTree.set(targetDir, { children: [], sum: 0 });
      // console.log(`Going to: ${targetDir}`);
    }

    currentDir = dirStack[dirStack.length - 1];
    // console.log(`Current dir: ${currentDir}`)
  }

  if (command.indexOf(dirCommand) !== -1) {
    const currDir = dirTree.get(currentDir);
    if (currDir) {
      currDir?.children.push(command.split(' ')[1]);
      dirTree.set(currentDir, currDir);
    } else {
      dirTree.set(currentDir, { children: [command.split(' ')[1]], sum: 0 })
    }
  }

  if (Number.isInteger(Number(command.split(' ')[0]))) {
    const data = dirTree.get(currentDir);
    const sum = data.sum + Number(command.split(' ')[0]);
    dirTree.set(currentDir, { ...data, sum });
  }
};

// let arr = [1, 2, 3, 4, 5, 6] 

// function add(arr) {
//     if (arr.length == 1) return arr[0] // base case
//     return arr[0] + add(arr.slice(1))  // recurse
// }

const sumChildren = (tree, child) => {
  const data = tree.get(child);
  console.log(data);

  if (data.children.length === 0) return data.sum;

  data.children.forEach((subChild) => {
    return data.sum + sumChildren(tree, subChild);
  });
}

// Search the tree
const searchForTarget = (tree) => {
  for (const [key, value] of tree) {
    if (value.children.length > 0 && value.sum < MAX_SIZE) {
      value.children.forEach((item) => {
        result += sumChildren(tree, item);
      });
    } else if (value.sum < MAX_SIZE) {
      result += value.sum;
    }
  }

  console.log(result);
};

testInput.forEach((item) => {
  // console.log(item);
  parseCommand(item);
});

searchForTarget(dirTree);

console.log(dirTree);
// console.log(dirStack);
// console.log(currentDir);
