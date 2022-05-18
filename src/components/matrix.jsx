import { useEffect, useRef, createRef } from "react";

const Matrix = ({ rows = 30, cols = 30 }) => {
  const defaultClass =
    "inline-block bg-green-700 w-[20px] h-[20px] leading-none";
  const refFood = useRef([5, 5]);
  const refDirection = useRef(0);
  const refIntervalId = useRef(null);

  const refSnake = useRef({
    head: [15, 15],
    body: [
      [15, 14],
      [15, 13],
      [15, 12],
    ],
  });

  const classDictionary = {
    empty: "",
    snake: " bg-blue-300 ",
    food: " bg-red-600 ",
    head: " bg-white ",
  };

  const refMatrix = useRef(
    [...Array(rows)].map(() => [...Array(cols)].map(() => createRef()))
  );

  const renderCol = (itemRef, className) => {
    itemRef.current.className = `${defaultClass} ${className}`;
  };

  useEffect(() => {
    paint();
  }, [cols, rows]);

  useEffect(() => {
    window.addEventListener("keyup", onKeyUp);
    refIntervalId.current = setInterval(() => {
      onKeyUp(undefined, refDirection.current);
    }, 250);
    return () => {
      document.removeEventListener("keyup", onKeyUp);
      clearInterval(refIntervalId.current);
    };
  }, []);

  const paint = (clear = false) => {
    const { head, body } = refSnake.current;
    renderCol(
      refMatrix.current[head[0]][head[1]],
      clear ? classDictionary.empty : classDictionary.head
    );
    body.forEach((bodyItem) => {
      renderCol(
        refMatrix.current[bodyItem[0]][bodyItem[1]],
        clear ? classDictionary.empty : classDictionary.snake
      );
    });
    renderCol(
      refMatrix.current[refFood.current[0]][refFood.current[1]],
      clear ? classDictionary.empty : classDictionary.food
    );
  };

  const onKeyUp = (e, keyCode) => {
    if (
      e?.keyCode &&
      e.keyCode !== 37 &&
      e.keyCode !== 38 &&
      e.keyCode !== 39 &&
      e.keyCode !== 40
    ) {
      return;
    }

    const { head, body } = refSnake.current;
    const newBody = [head];
    let newHead;
    const direction = e?.keyCode || keyCode;

    if ((!e?.keyCode && !keyCode) || !head) return;
    if (direction !== 0) paint(true);
    if (direction === 38) {
      // up
      newHead = [head[0] - 1, head[1]];
      refDirection.current = 38;
    }
    if (direction === 37) {
      // left
      newHead = [head[0], head[1] - 1];
      refDirection.current = 37;
    }
    if (direction === 39) {
      // right
      newHead = [head[0], head[1] + 1];
      refDirection.current = 39;
    }
    if (direction === 40) {
      // down
      newHead = [head[0] + 1, head[1]];
      refDirection.current = 40;
    }
    let didIEatFood = false;
    if (
      newHead[0] === refFood.current[0] &&
      newHead[1] === refFood.current[1]
    ) {
      refFood.current = [
        Math.floor(Math.random() * rows),
        Math.floor(Math.random() * cols),
      ];
      didIEatFood = true;
    }
    const maxBody = didIEatFood ? body.length : body.length - 1;
    // paint body
    for (let i = 0; i < maxBody; i++) {
      newBody.push([body[i][0], body[i][1]]);
    }

    if (
      newHead[0] < 0 ||
      newHead[0] > rows - 1 ||
      newHead[1] < 0 ||
      newHead[1] > cols - 1
    ) {
      alert("Game Over");
      clearInterval(refIntervalId.current);
      return;
    }

    body?.forEach((bodyItem) => {
      if (bodyItem[0] === newHead[0] && bodyItem[1] === newHead[1]) {
        alert("Game Over");
        clearInterval(refIntervalId.current);
        return;
      }
    });
    refSnake.current = {
      head: newHead,
      body: newBody,
    };

    paint();
  };

  return (
    <div className="p-32 text-center">
      <div className="inline-block leading-none">
        {refMatrix.current.map((row, i) => (
          <div className={`w-[600px] leading-none h-[20px]`} key={i}>
            {row.map((col, j) => (
              <div key={j} ref={col} className={defaultClass}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matrix;
