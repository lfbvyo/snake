import { useEffect, useState } from "react";

const Matrix = ({ rows = 30, cols = 30 }) => {
  /*
   *   Matrix
   *   empty = 0
   *   snake = 5
   *   food = 1
   *   head = 2
   */
  const [matrix, setMatrix] = useState([]);
  const [food, setFood] = useState([5, 5]);
  const [snake, setSnake] = useState({
    head: [15, 15],
    body: [
      [15, 14],
      [15, 13],
      [15, 12],
    ],
  });

  const renderCol = (val) => {
    switch (val) {
      case 0:
        return "";
      case 5:
        return "bg-blue-300";
      case 1:
        return "bg-red-600 animate-ping ";
      case 2:
        return "bg-white";
      default:
        return "";
    }
  };

  useEffect(() => {
    const initialMatrix = clearMatrix();
    setMatrix(initialMatrix);
    paintSnake(initialMatrix);
  }, [cols, rows]);

  //   useEffect(() => {
  //     window.addEventListener("keyup", onKeyUp);
  //     return document.removeEventListener("keyup", onKeyUp);
  //   }, []);

  const paintSnake = () => {
    const newMatrix = clearMatrix();
    const { head, body } = snake;
    newMatrix[head[0]][head[1]] = 2;
    for (let i = 0; i < body.length; i++) {
      newMatrix[body[i][0]][body[i][1]] = 5;
    }
    setMatrix(newMatrix);
  };

  const clearMatrix = () => {
    const initialMatrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(0);
      }
      initialMatrix.push(row);
    }
    initialMatrix[food[0]][food[1]] = 1;
    return initialMatrix;
  };

  const onKeyUp = (e) => {
    console.log("keyup", e.keyCode);
    const { head, body } = snake;
    const newBody = [head];
    let newHead;
    if (!e.keyCode || !head) return;

    if (e.keyCode === 38) {
      // up
      newHead = [head[0] - 1, head[1]];
    }
    if (e.keyCode === 37) {
      // left
      newHead = [head[0], head[1] - 1];
    }
    if (e.keyCode === 39) {
      // right
      newHead = [head[0], head[1] + 1];
    }
    if (e.keyCode === 40) {
      // down
      newHead = [head[0] + 1, head[1]];
    }
    let didIEatFood = false;
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setFood([
        Math.floor(Math.random() * rows),
        Math.floor(Math.random() * cols),
      ]);
      didIEatFood = true;
    }
    const maxBody = didIEatFood ? body.length : body.length - 1;
    // paint body
    for (let i = 0; i < maxBody; i++) {
      newBody.push([[body[i][0]], [body[i][1]]]);
    }

    if (
      newHead[0] < 0 ||
      newHead[0] > rows - 1 ||
      newHead[1] < 0 ||
      newHead[1] > cols - 1
    ) {
      alert("Game Over");
      return;
    }

    body?.forEach((bodyItem) => {
      if (bodyItem[0] === newHead[0] && bodyItem[1] === newHead[1]) {
        alert("Game Over");
        return;
      }
    });
    setSnake({
      head: newHead,
      body: newBody,
    });
    paintSnake(matrix);
  };

  return (
    <div className="text-center p-32">
      <input onKeyUp={onKeyUp} />
      <div className="inline-block leading-none">
        {matrix.map((row, i) => (
          <div className={`w-[600px] leading-none h-[20px]`} key={i}>
            {row.map((col, j) => (
              <div
                key={j}
                className={`inline-block bg-green-700 w-[20px] h-[20px] leading-none ${renderCol(
                  matrix[i][j]
                )}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matrix;
