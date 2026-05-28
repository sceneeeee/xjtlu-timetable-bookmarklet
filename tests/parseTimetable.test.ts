import { describe, expect, it } from "vitest";
import { parseTimetableFromDocument, parseTimetableFromPage } from "../src/lib/parseTimetable";

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

    expect(parseTimetableFromPage()).toHaveLength(1);
  });
});
