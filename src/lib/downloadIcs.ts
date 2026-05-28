const CALENDAR_MIME_TYPE = "text/calendar;charset=utf-8";
const DEFAULT_FILENAME = "xjtlu_timetable.ics";

type ShareCapableNavigator = Navigator & {
  canShare?: (data: ShareData) => boolean;
  share?: (data: ShareData) => Promise<void>;
};

export async function downloadIcs(icsText: string, filename = DEFAULT_FILENAME): Promise<void> {
  const finalFilename = filename.trim() || DEFAULT_FILENAME;
  const file = createCalendarFile(icsText, finalFilename);
  const blob = file ?? new Blob([icsText], { type: CALENDAR_MIME_TYPE });

  try {
    if (file && (await tryNativeShare(file))) {
      return;
    }

    downloadWithAnchor(blob, finalFilename);
  } catch (error) {
    alertDownloadFailure(error);
  }
}

async function tryNativeShare(file: File): Promise<boolean> {
  const nav = navigator as ShareCapableNavigator;

  if (!nav.share || !nav.canShare || !nav.canShare({ files: [file] })) {
    return false;
  }

  try {
    await nav.share({
      files: [file],
      title: "XJTLU Timetable",
      text: "XJTLU timetable calendar file"
    });
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return true;
    }

    return false;
  }
}

function createCalendarFile(icsText: string, filename: string): File | undefined {
  if (typeof File === "undefined") {
    return undefined;
  }

  return new File([icsText], filename, { type: CALENDAR_MIME_TYPE });
}

function downloadWithAnchor(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";

  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function alertDownloadFailure(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  window.alert(`Could not download or share the calendar file. ${message}`);
}
