import { describe, expect, it } from "vitest";
import { findBestUsableFrameUrl, toUsableFrameUrl } from "../src/bookmarklet/main";

describe("bookmarklet iframe URL fallback", () => {
  it("resolves normal http and https frame URLs", () => {
    document.body.innerHTML = `<iframe src="/pt/#/example-token?start=1&end=13"></iframe>`;
    const frame = document.querySelector("iframe");
    const httpFrame = document.createElement("iframe");

    httpFrame.setAttribute("src", "http://example.edu/frame");

    expect(frame ? toUsableFrameUrl(frame, "https://timetableplus.xjtlu.edu.cn/outer/page") : undefined).toBe(
      "https://timetableplus.xjtlu.edu.cn/pt/#/example-token?start=1&end=13"
    );
    expect(toUsableFrameUrl(httpFrame, "https://example.edu/")).toBe("http://example.edu/frame");
  });

  it("rejects empty, about:blank, and javascript frame URLs", () => {
    const frames = ["", "about:blank", "javascript:alert(1)"].map((src) => {
      const frame = document.createElement("iframe");
      frame.setAttribute("src", src);
      return frame;
    });

    expect(frames.map((frame) => toUsableFrameUrl(frame, "https://example.edu/"))).toEqual([
      undefined,
      undefined,
      undefined
    ]);
  });

  it("prefers timetableplus.xjtlu.edu.cn over other usable frame URLs", () => {
    document.body.innerHTML = `
      <iframe src="https://example.edu/announcements"></iframe>
      <iframe src="https://timetableplus.xjtlu.edu.cn/pt/#/example-token?start=1&end=13"></iframe>
    `;

    expect(findBestUsableFrameUrl(document)).toBe(
      "https://timetableplus.xjtlu.edu.cn/pt/#/example-token?start=1&end=13"
    );
  });
});
