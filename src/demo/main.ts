import { runXjtluTimetableExporter } from "../bookmarklet/main";

const runButton = document.querySelector<HTMLButtonElement>("#run-demo-export");
const demoFrame = document.querySelector<HTMLIFrameElement>("#demo-timetable-frame");

runButton?.addEventListener("click", async () => {
  const demoDocument = demoFrame?.contentDocument;

  if (!demoDocument) {
    window.alert("The demo timetable could not be loaded.");
    return;
  }

  await runXjtluTimetableExporter(demoDocument);
});
