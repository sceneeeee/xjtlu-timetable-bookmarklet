# XJTLU Timetable Exporter

一个无服务器、书签脚本风格的工具，用于把 XJTLU e-Bridge 课表导出为 iCalendar `.ics` 文件。

这个项目是一个面向 macOS 浏览器的开源演示项目。它不是 iOS App，不需要后端服务器，也不是 App Store Safari 扩展。用户在 Safari、Chrome 或 Edge 中打开 XJTLU e-Bridge 课表页面后运行书签脚本，脚本会在浏览器本地解析页面 DOM、生成 `.ics` 文件，并触发下载或系统分享。

## 功能范围

- 在浏览器本地解析 `table.timetable` 课表 DOM。
- 支持 XJTLU e-Bridge 风格的周次文本，例如 `Week: 1-6,8-`。
- 根据 Week 1 Monday 和 Last Week 展开所有上课日期。
- 生成 iCalendar `.ics` 文件。
- 可选添加课前 30 分钟提醒和课前 1 天提醒。
- 支持本地演示页面，无需登录 e-Bridge 即可测试。

## 隐私

所有课表解析和 `.ics` 生成都在浏览器本地完成。项目不会上传课表数据，也不需要服务器保存任何信息。

## macOS 开发

要求：

- macOS
- Node.js 20+
- npm

```sh
npm install
npm run dev
npm test
npm run build
```

`npm run dev` 会启动本地演示页面。`npm run build` 会生成：

- `dist/bookmarklet.js`
- `dist/bookmarklet.min.js`

构建完成后，可以打印书签脚本 URL：

```sh
npm run print:bookmarklet
```

## 使用演示页面测试

1. 运行 `npm install`。
2. 运行 `npm run dev`。
3. 打开终端中显示的本地 Vite 地址。
4. 点击 **Run Demo Export**。
5. Week 1 Monday 输入 `2026-03-02`，Last Week 输入 `13`。
6. 选择是否添加提醒。
7. 保存或分享生成的 `xjtlu_timetable.ics` 文件。

演示页面会加载 `src/demo/demoTimetable.html`，其中包含一份 XJTLU 风格的示例课表 HTML。

## 在 macOS Safari 中安装书签脚本

1. 运行 `npm run build`。
2. 运行 `npm run print:bookmarklet`。
3. 复制输出的 `javascript:(()=>{...})()` URL。
4. 在 Safari 中通过 **View > Show Favorites Bar** 显示收藏栏。
5. 随便把一个网页添加到收藏栏。
6. 编辑该收藏项，把名称改成 `Export XJTLU Timetable`，并把地址替换成刚才复制的书签脚本 URL。

Chrome 和 Edge 也可以用类似方式把脚本保存到书签栏。

## 在真实 e-Bridge 课表页面使用

1. 在 macOS 的 Safari、Chrome 或 Edge 中打开 XJTLU e-Bridge 课表页面。
2. 确认课表已经显示在页面上。
3. 点击 `Export XJTLU Timetable` 书签脚本。
4. 输入 Week 1 的星期一日期，例如 `2026-03-02`。
5. 输入最后一个教学周，例如 `13`。
6. 选择是否添加提醒。
7. 保存、下载或分享生成的 `.ics` 文件。
8. 将 `.ics` 文件导入 Apple Calendar、Google Calendar、Outlook 或其他日历应用。

## 限制

- 这不是正式的 Safari App Store 扩展。
- iOS 上安装和使用书签脚本没有安装 App 顺畅。
- 将 `.ics` 导入 Apple Calendar 时，系统仍可能要求用户确认。
- 如果 XJTLU 修改 e-Bridge 页面 DOM 结构，解析器可能需要更新。

## 项目结构

```text
src/
  lib/
    types.ts
    parseTimetable.ts
    parseWeeks.ts
    expandOccurrences.ts
    generateIcs.ts
    downloadIcs.ts
  bookmarklet/
    main.ts
  demo/
    index.html
    demoTimetable.html
tests/
  parseTimetable.test.ts
  parseWeeks.test.ts
  generateIcs.test.ts
```

## 免责声明

这是一个非官方社区项目，与西交利物浦大学无隶属关系，也未获得西交利物浦大学认可或背书。

## License

MIT

---

# XJTLU Timetable Exporter

A no-server bookmarklet-style tool that exports XJTLU e-Bridge timetables to iCalendar `.ics` files.

This project is an open-source demo for macOS browsers. It is not an iOS app, does not require a backend server, and is not an App Store Safari extension. The user opens the XJTLU e-Bridge timetable page in Safari, Chrome, or Edge, runs the bookmarklet, and the script parses the page DOM locally, generates an `.ics` file, then downloads or shares it.

## Scope

- Parse `table.timetable` timetable DOM locally in the browser.
- Support XJTLU e-Bridge style week text, such as `Week: 1-6,8-`.
- Expand class dates from Week 1 Monday and Last Week.
- Generate an iCalendar `.ics` file.
- Optionally add 30-minute and 1-day reminders.
- Include a local demo page for testing without logging into e-Bridge.

## Privacy

All timetable parsing and `.ics` generation are performed locally in the browser. No timetable data is uploaded, and no server stores any information.

## Development On macOS

Requirements:

- macOS
- Node.js 20+
- npm

```sh
npm install
npm run dev
npm test
npm run build
```

`npm run dev` starts the local demo page. `npm run build` creates:

- `dist/bookmarklet.js`
- `dist/bookmarklet.min.js`

After building, print a bookmarklet URL with:

```sh
npm run print:bookmarklet
```

## Test With The Demo Page

1. Run `npm install`.
2. Run `npm run dev`.
3. Open the local Vite URL shown in the terminal.
4. Click **Run Demo Export**.
5. Enter `2026-03-02` for Week 1 Monday and `13` for Last Week.
6. Choose whether to add reminders.
7. Save or share the generated `xjtlu_timetable.ics` file.

The demo page loads `src/demo/demoTimetable.html`, which contains sample XJTLU-like timetable markup.

## Install The Bookmarklet In Safari On macOS

1. Run `npm run build`.
2. Run `npm run print:bookmarklet`.
3. Copy the printed `javascript:(()=>{...})()` URL.
4. In Safari, show the Favorites bar with **View > Show Favorites Bar**.
5. Add any page to Favorites.
6. Edit that favorite, rename it to `Export XJTLU Timetable`, and replace its address with the printed bookmarklet URL.

Chrome and Edge support the same general flow through the bookmarks bar.

## Use On The Real e-Bridge Timetable Page

1. Open the XJTLU e-Bridge timetable page in Safari, Chrome, or Edge on macOS.
2. Make sure the timetable is visible on the page.
3. Click the `Export XJTLU Timetable` bookmarklet.
4. Enter the Monday date for Week 1, for example `2026-03-02`.
5. Enter the final teaching week number, for example `13`.
6. Choose reminder options.
7. Save, download, or share the generated `.ics` file.
8. Import the `.ics` file into Apple Calendar, Google Calendar, Outlook, or another calendar app.

## Limitations

- This is not a real Safari App Store extension.
- iOS installation of bookmarklets is less smooth than installing an app.
- Importing `.ics` into Apple Calendar may still require user confirmation.
- If XJTLU changes the e-Bridge DOM structure, the parser may need updates.

## Project Structure

```text
src/
  lib/
    types.ts
    parseTimetable.ts
    parseWeeks.ts
    expandOccurrences.ts
    generateIcs.ts
    downloadIcs.ts
  bookmarklet/
    main.ts
  demo/
    index.html
    demoTimetable.html
tests/
  parseTimetable.test.ts
  parseWeeks.test.ts
  generateIcs.test.ts
```

## Disclaimer

This is an unofficial community project and is not affiliated with or endorsed by Xi'an Jiaotong-Liverpool University.

## License

MIT
