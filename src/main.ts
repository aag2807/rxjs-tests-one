import "./style.css";

import { fromEvent, interval, merge, of } from "rxjs";
import { map, takeUntil, delay } from "rxjs/operators";

const app = document.querySelector<HTMLDivElement>("#app")!;

const createButton = (content: string = "", id: string = ""): void => {
  let btn = document.createElement("button");
  btn.setAttribute("id", id);
  btn.innerText = content;
  btn.style.border = "none";
  btn.style.outline = "none";
  btn.style.padding = "20px 40px";
  btn.style.margin = "0px 20px";
  btn.style.background = "lightblue";

  btn.addEventListener("mouseover", () => {
    btn.style.cursor = "pointer";
  });

  btn.addEventListener("mouseout", () => {
    btn.style.cursor = "";
  });

  app.appendChild(btn);
};

createButton("Start", "start-button");
createButton("Stop", "stop-button");

const startBtn = document.querySelector<HTMLButtonElement>("#start-button")!;
const stopBtn = document.querySelector<HTMLButtonElement>("#stop-button")!;
const output = document.querySelector<HTMLSpanElement>("#output")!;

const startClick$ = fromEvent(startBtn, "click");
const stopClick$ = fromEvent(stopBtn, "click");
const tenthSecond$ = interval(100);

startClick$.subscribe(() => {
  tenthSecond$
    .pipe(
      map((item) => item / 10),
      takeUntil(stopClick$)
    )
    .subscribe((num) => (output.innerHTML = num + "s"));
});


const draggable = document.querySelector<HTMLDivElement>('#draggable')!

const mouseDown$ = fromEvent<MouseEvent>(draggable, 'mousedown');
const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

mouseDown$.subscribe(()=>{
  mouseMove$
  .pipe(
    map(event => {
      event.preventDefault();
      return {
        x: event.clientX,
        y: event.clientY
      }
    }),
    takeUntil(mouseUp$)
  ).subscribe(pos => {
    draggable.style.left = pos.x - 150 +'px'
    draggable.style.top= pos.y - 100+'px'
  })

})
  
let startProgress$ = interval(200);

const progressbar = document.querySelector<HTMLProgressElement>('#progress-bar')!;
const progreslabel = document.querySelector<HTMLLabelElement>('label')!


let fulldata = new CustomEvent('fulldata', {
  detail: {
    value: 100
  }
})

let progress$ = fromEvent(progressbar, 'fulldata')


startProgress$
.pipe(
  takeUntil(progress$)
)
.subscribe((val) => {
  progreslabel.innerText = `${progressbar.value}%
  `
  if(progressbar.value >= 50) {
    progressbar.dispatchEvent(fulldata)
    progreslabel.innerText = "error occurred at 50%"
    progreslabel.style.color = "red" 
  }
  progressbar.value = val 
})


let one$ = of('one').pipe(delay(1000))
let two$ = of('two').pipe(delay(2000))
let three$ = of('three').pipe(delay(3000))


merge(
  one$,
  two$,
  three$
).subscribe(console.log)