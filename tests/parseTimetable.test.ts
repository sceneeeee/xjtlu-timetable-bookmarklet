import { describe, expect, it } from "vitest";
import {
  findTimetableDocumentFromPage,
  formatTimetableDetectionDebug,
  parseTimetableFromDocument,
  parseTimetableFromPageWithDebug
} from "../src/lib/parseTimetable";

const sampleTimetableHtml = `
  <table class="timetable">
    <tr>
      <td class="day-cell" data-day="MON">
        <div class="event">
          <div class="event-name">  MEC103-Lecture-D1  </div>
          <div class="event-info">YAN   YAN</div>
          <div class="event-info">SIP-EB237</div>
          <div class="event-info">Week: 1-6,8-</div>
          <div class="event-info">09:00 - 10:50</div>
        </div>
      </td>
    </tr>
  </table>
`;

describe("parseTimetableFromDocument", () => {
  it("parses XJTLU-like timetable events", () => {
    document.body.innerHTML = sampleTimetableHtml;

    expect(parseTimetableFromDocument(document)).toEqual([
      {
        day: "MON",
        title: "MEC103-Lecture-D1",
        teacher: "YAN YAN",
        location: "SIP-EB237",
        weekText: "Week: 1-6,8-",
        startTime: "09:00",
        endTime: "10:50"
      }
    ]);
  });

  it("parses course-like timetable content without fixed XJTLU CSS classes", () => {
    document.body.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Monday</th>
            <th>Tuesday</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>
                <span>MEC103 Lecture D1</span>
                <span>YAN YAN</span>
                <span>SIP-EB237</span>
                <span>Week: 1-6,8-</span>
                <span>09:00 - 10:50</span>
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `;

    expect(parseTimetableFromDocument(document)).toEqual([
      {
        day: "MON",
        title: "MEC103 Lecture D1",
        teacher: "YAN YAN",
        location: "SIP-EB237",
        weekText: "Week: 1-6,8-",
        startTime: "09:00",
        endTime: "10:50"
      }
    ]);
  });

  it("ignores invalid events", () => {
    document.body.innerHTML = `
      <table class="timetable">
        <td class="day-cell" data-day="MON">
          <div class="event">
            <div class="event-name"></div>
            <div class="event-info">Week: 1</div>
            <div class="event-info">09:00 - 10:50</div>
          </div>
        </td>
      </table>
    `;

    expect(parseTimetableFromDocument(document)).toEqual([]);
  });
});

describe("parseTimetableFromPage", () => {
  it("falls back to accessible iframe documents", () => {
    document.body.innerHTML = `<iframe title="timetable"></iframe>`;
    const iframe = document.querySelector("iframe");

    iframe?.contentDocument?.open();
    iframe?.contentDocument?.write(sampleTimetableHtml);
    iframe?.contentDocument?.close();

    expect(parseTimetableFromPageWithDebug().events).toHaveLength(1);
  });

  it("detects and parses timetable-like content inside accessible iframes", () => {
    document.body.innerHTML = `<iframe title="student timetable"></iframe>`;
    const iframe = document.querySelector("iframe");

    iframe?.contentDocument?.open();
    iframe?.contentDocument?.write(`
      <table>
        <tr>
          <th>Monday</th>
        </tr>
        <tr>
          <td>
            <div>
              MTH102 Tutorial<br>
              ZHANG SAN<br>
              SIP-IR201<br>
              Week: 2,4,6<br>
              13:00 - 13:50
            </div>
          </td>
        </tr>
      </table>
    `);
    iframe?.contentDocument?.close();

    const result = parseTimetableFromPageWithDebug();

    expect(result.events).toEqual([
      {
        day: "MON",
        title: "MTH102 Tutorial",
        teacher: "ZHANG SAN",
        location: "SIP-IR201",
        weekText: "Week: 2,4,6",
        startTime: "13:00",
        endTime: "13:50"
      }
    ]);
    expect(result.debug.frames[0]?.accessible).toBe(true);
  });

  it("formats useful debug information when no timetable document is found", () => {
    document.body.innerHTML = `<main>Welcome to e-Bridge</main><iframe title="empty"></iframe>`;
    const result = findTimetableDocumentFromPage();
    const debugText = formatTimetableDetectionDebug(result.debug);

    expect(result.document).toBeUndefined();
    expect(debugText).toContain("Current URL:");
    expect(debugText).toContain("Document title:");
    expect(debugText).toContain("Iframes/frames found: 1");
    expect(debugText).toContain("Body preview:");
  });
});
