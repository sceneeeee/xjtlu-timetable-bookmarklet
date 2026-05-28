# XJTLU Timetable Bookmarklet

一个在 iPhone Safari 里使用的书签脚本，用来把 XJTLU e-Bridge 课表导出为 iCalendar `.ics` 文件。

这不是原生 iOS App，也不是 App Store Safari 扩展。它是一个 iOS Safari bookmarklet（书签脚本）工作流：你打开 e-Bridge 课表页面，点一下 Safari 书签，脚本就在浏览器本地读取课表并生成日历文件。整个过程无服务器，课表数据不会上传。

## 这个工具能做什么

- 读取当前 XJTLU e-Bridge 课表页面里的课程信息。
- 询问 Week 1 Monday 和 Last Week，把教学周展开成真实日期。
- 在浏览器本地生成 `xjtlu_timetable.ics`。
- 可选择添加课前 30 分钟提醒和课前 1 天提醒。
- 通过 iOS 分享面板保存、分享或导入生成的 `.ics` 文件。

## iPhone / iOS Safari 直接使用教程

第一次使用需要先安装书签脚本。安装完成后，以后每次导出只需要打开课表页面并点击这个书签。

1. 在 iPhone 上用 Safari 打开本 README。
2. 复制下面 “Copy the bookmarklet” 里的整行 `javascript:(()=>{...})()`。
3. 在 Safari 中随便添加一个书签。
4. 编辑刚保存的书签，把名称改成 `Export XJTLU Timetable`。
5. 把书签网址删掉，粘贴刚才复制的 bookmarklet。
6. 打开 XJTLU e-Bridge 课表页面。
7. 点 Safari 书签按钮，选择 `Export XJTLU Timetable`。
8. 按提示输入 Week 1 Monday 和 Last Week，然后保存或分享生成的 `.ics` 文件。

## Copy the bookmarklet

下面这一整行就是可复制的书签脚本。iPhone 上建议长按代码块内容，尽量选择整行复制。仓库里也提供了纯文本版本：[docs/bookmarklet-url.txt](docs/bookmarklet-url.txt)。

<details>
<summary>展开 / 收起 bookmarklet URL</summary>

```text
javascript:(()=>{var%20XjtluTimetableExporter%3Dfunction(b)%7B%22use%20strict%22%3Bconst%20L%3D%22text%2Fcalendar%3Bcharset%3Dutf-8%22%2CI%3D%22xjtlu_timetable.ics%22%3Basync%20function%20q(e%2Ct%3DI)%7Bconst%20n%3Dt.trim()%7C%7CI%2Cr%3DQ(e%2Cn)%2Co%3Dr%3F%3Fnew%20Blob(%5Be%5D%2C%7Btype%3AL%7D)%3Btry%7Bif(r%26%26await%20K(r))return%3Bee(o%2Cn)%7Dcatch(i)%7Bte(i)%7D%7Dasync%20function%20K(e)%7Bconst%20t%3Dnavigator%3Bif(!t.share%7C%7C!t.canShare%7C%7C!t.canShare(%7Bfiles%3A%5Be%5D%7D))return!1%3Btry%7Breturn%20await%20t.share(%7Bfiles%3A%5Be%5D%2Ctitle%3A%22XJTLU%20Timetable%22%2Ctext%3A%22XJTLU%20timetable%20calendar%20file%22%7D)%2C!0%7Dcatch(n)%7Breturn%20n%20instanceof%20DOMException%26%26n.name%3D%3D%3D%22AbortError%22%7D%7Dfunction%20Q(e%2Ct)%7Bif(!(typeof%20File%3E%22u%22))return%20new%20File(%5Be%5D%2Ct%2C%7Btype%3AL%7D)%7Dfunction%20ee(e%2Ct)%7Bconst%20n%3DURL.createObjectURL(e)%2Cr%3Ddocument.createElement(%22a%22)%3Br.href%3Dn%2Cr.download%3Dt%2Cr.rel%3D%22noopener%22%2Cr.style.display%3D%22none%22%2Cdocument.body.append(r)%2Cr.click()%2Cr.remove()%2Cwindow.setTimeout(()%3D%3E%7BURL.revokeObjectURL(n)%7D%2C1e3)%7Dfunction%20te(e)%7Bconst%20t%3De%20instanceof%20Error%3Fe.message%3AString(e)%3Bwindow.alert(%60Could%20not%20download%20or%20share%20the%20calendar%20file.%20%24%7Bt%7D%60)%7Dfunction%20ne(e%2Ct)%7Bconst%20n%3DMath.floor(t)%3Bif(!Number.isFinite(n)%7C%7Cn%3C1)return%5B%5D%3Bconst%20r%3De.replace(%2F%5Cu00a0%2Fg%2C%22%20%22).trim().replace(%2F%5EWeek%5Cs*%3A%5Cs*%2Fi%2C%22%22).trim()%3Bif(!r)return%5B%5D%3Bconst%20o%3Dnew%20Set%3Bfor(const%20i%20of%20r.split(%22%2C%22))%7Bconst%20a%3Di.trim()%3Bif(!a)continue%3Bconst%20s%3Da.match(%2F%5E(%5Cd%2B)%24%2F)%3Bif(s)%7Bo.add(Number(s%5B1%5D))%3Bcontinue%7Dconst%20u%3Da.match(%2F%5E(%5Cd%2B)%5Cs*-%5Cs*%24%2F)%3Bif(u)%7BR(o%2CNumber(u%5B1%5D)%2Cn)%3Bcontinue%7Dconst%20c%3Da.match(%2F%5E(%5Cd%2B)%5Cs*-%5Cs*(%5Cd%2B)%24%2F)%3Bif(c)%7Bconst%20f%3DNumber(c%5B1%5D)%2Cm%3DNumber(c%5B2%5D)%3Bf%3C%3Dm%26%26R(o%2Cf%2Cm)%7D%7Dreturn%5B...o%5D.filter(i%3D%3ENumber.isInteger(i)%26%26i%3E%3D1%26%26i%3C%3Dn).sort((i%2Ca)%3D%3Ei-a)%7Dfunction%20R(e%2Ct%2Cn)%7Bif(!(!Number.isInteger(t)%7C%7C!Number.isInteger(n)))for(let%20r%3Dt%3Br%3C%3Dn%3Br%2B%3D1)e.add(r)%7Dconst%20re%3D%7BMON%3A0%2CTUE%3A1%2CWED%3A2%2CTHU%3A3%2CFRI%3A4%2CSAT%3A5%2CSUN%3A6%7D%3Bfunction%20oe(e%2Ct)%7Bconst%20n%3Die(t.week1Monday)%3Breturn%20n%3Fe.flatMap(o%3D%3Ene(o.weekText%2Ct.lastWeek).map(a%3D%3E%7Bconst%20s%3Dae(n%2C(a-1)*7%2Bre%5Bo.day%5D)%2Cu%3Dse(s)%2Cc%3Do.location%3F%3F%22%22%3Breturn%7BsourceId%3A%60xjtlu%3A%24%7Bo.title%7D%3A%24%7Bu%7D%3A%24%7Bo.startTime%7D%3A%24%7Bo.endTime%7D%3A%24%7Bc%7D%60%2Ctitle%3Ao.title%2CstartDate%3A%60%24%7Bu%7DT%24%7Bo.startTime%7D%3A00%60%2CendDate%3A%60%24%7Bu%7DT%24%7Bo.endTime%7D%3A00%60%2C...o.location%3F%7Blocation%3Ao.location%7D%3A%7B%7D%2C...o.teacher%3F%7Bteacher%3Ao.teacher%7D%3A%7B%7D%2CweekText%3Ao.weekText%2CoriginalTime%3A%60%24%7Bo.startTime%7D%20-%20%24%7Bo.endTime%7D%60%2CweekNumber%3Aa%7D%7D)).sort((o%2Ci)%3D%3E%7Bconst%20a%3Do.startDate.localeCompare(i.startDate)%3Breturn%20a%3D%3D%3D0%3Fo.title.localeCompare(i.title)%3Aa%7D)%3A%5B%5D%7Dfunction%20ie(e)%7Bconst%20t%3De.match(%2F%5E(%5Cd%7B4%7D)-(%5Cd%7B2%7D)-(%5Cd%7B2%7D)%24%2F)%3Bif(!t)return%3Bconst%20n%3DNumber(t%5B1%5D)%2Cr%3DNumber(t%5B2%5D)%2Co%3DNumber(t%5B3%5D)%2Ci%3Dnew%20Date(Date.UTC(n%2Cr-1%2Co))%3Bif(!(i.getUTCFullYear()!%3D%3Dn%7C%7Ci.getUTCMonth()!%3D%3Dr-1%7C%7Ci.getUTCDate()!%3D%3Do))return%20i%7Dfunction%20ae(e%2Ct)%7Bconst%20n%3Dnew%20Date(e.getTime())%3Breturn%20n.setUTCDate(n.getUTCDate()%2Bt)%2Cn%7Dfunction%20se(e)%7Breturn%20e.toISOString().slice(0%2C10)%7Dconst%20M%3D%60%5Cr%0A%60%2Cce%3D%60%0A%60%3Bfunction%20ue(e)%7Bvar%20i%2Ca%3Bconst%20t%3De.timezone%3F%3F%22Asia%2FShanghai%22%2Cn%3De.calendarName%3F%3F%22XJTLU%20Timetable%22%2Cr%3Dme(new%20Date)%2Co%3D%5B%22BEGIN%3AVCALENDAR%22%2C%22VERSION%3A2.0%22%2C%22PRODID%3A-%2F%2FXJTLU%20Timetable%20Exporter%2F%2FEN%22%2C%22CALSCALE%3AGREGORIAN%22%2C%22METHOD%3APUBLISH%22%2C%60X-WR-TIMEZONE%3A%24%7Bt%7D%60%2C%60X-WR-CALNAME%3A%24%7Bg(n)%7D%60%5D%3Bt%3D%3D%3D%22Asia%2FShanghai%22%26%26o.push(...fe())%3Bfor(const%20s%20of%20e.occurrences)%7Bconst%20u%3Dk(s.startDate)%2Cc%3Dk(s.endDate)%3B!u%7C%7C!c%7C%7C(o.push(%22BEGIN%3AVEVENT%22%2C%60UID%3A%24%7BTe(s.sourceId)%7D%40xjtlu-timetable-exporter%60%2C%60DTSTAMP%3A%24%7Br%7D%60%2C%60DTSTART%3BTZID%3D%24%7Bt%7D%3A%24%7Bu%7D%60%2C%60DTEND%3BTZID%3D%24%7Bt%7D%3A%24%7Bc%7D%60%2C%60SUMMARY%3A%24%7Bg(s.title)%7D%60%2C%60LOCATION%3A%24%7Bg(de(s.location))%7D%60%2C%60DESCRIPTION%3A%24%7Bg(le(s))%7D%60)%2C(i%3De.reminders)!%3Dnull%26%26i.thirtyMinutesBefore%26%26o.push(...U(%22-PT30M%22))%2C(a%3De.reminders)!%3Dnull%26%26a.oneDayBefore%26%26o.push(...U(%22-P1D%22))%2Co.push(%22END%3AVEVENT%22))%7Dreturn%20o.push(%22END%3AVCALENDAR%22)%2C%60%24%7Bo.join(M)%7D%24%7BM%7D%60%7Dfunction%20g(e)%7Breturn(e%3F%3F%22%22).replace(%2F%5C%5C%2Fg%2C%22%5C%5C%5C%5C%22).replace(%2F%5Cr%5Cn%7C%5Cr%7C%5Cn%2Fg%2C%22%5C%5Cn%22).replace(%2F%2C%2Fg%2C%22%5C%5C%2C%22).replace(%2F%3B%2Fg%2C%22%5C%5C%3B%22)%7Dfunction%20le(e)%7Breturn%5B%60Teacher%3A%20%24%7Be.teacher%3F%3F%22%22%7D%60%2C%60Week%3A%20%24%7Be.weekText%7D%60%2C%60Original%20time%3A%20%24%7Be.originalTime%7D%60%2C%22Source%3A%20XJTLU%20e-Bridge%22%5D.join(ce)%7Dfunction%20de(e)%7Bconst%20t%3D(e%3F%3F%22%22).trim()%3Breturn!t%7C%7Ct.toLowerCase()%3D%3D%3D%22no%20location%20required%22%7C%7Ct.includes(%22%E8%A5%BF%E4%BA%A4%E5%88%A9%E7%89%A9%E6%B5%A6%22)%3Ft%3A%60%24%7Bt%7D%2C%20%E8%A5%BF%E4%BA%A4%E5%88%A9%E7%89%A9%E6%B5%A6%60%7Dfunction%20k(e)%7Bconst%20t%3De.match(%2F%5E(%5Cd%7B4%7D)-(%5Cd%7B2%7D)-(%5Cd%7B2%7D)%5BT%5Cs%5D(%5Cd%7B1%2C2%7D)%3A(%5Cd%7B2%7D)(%3F%3A%3A(%5Cd%7B2%7D))%3F%24%2F)%3Bif(t)return%60%24%7Bt%5B1%5D%7D%24%7Bt%5B2%5D%7D%24%7Bt%5B3%5D%7DT%24%7Bt%5B4%5D.padStart(2%2C%220%22)%7D%24%7Bt%5B5%5D%7D%24%7Bt%5B6%5D%3F%3F%2200%22%7D%60%7Dfunction%20me(e)%7Breturn%20e.toISOString().replace(%2F%5B-%3A%5D%2Fg%2C%22%22).replace(%2F%5C.%5Cd%7B3%7DZ%24%2F%2C%22Z%22)%7Dfunction%20U(e)%7Breturn%5B%22BEGIN%3AVALARM%22%2C%22ACTION%3ADISPLAY%22%2C%22DESCRIPTION%3AClass%20reminder%22%2C%60TRIGGER%3A%24%7Be%7D%60%2C%22END%3AVALARM%22%5D%7Dfunction%20fe()%7Breturn%5B%22BEGIN%3AVTIMEZONE%22%2C%22TZID%3AAsia%2FShanghai%22%2C%22X-LIC-LOCATION%3AAsia%2FShanghai%22%2C%22BEGIN%3ASTANDARD%22%2C%22TZOFFSETFROM%3A%2B0800%22%2C%22TZOFFSETTO%3A%2B0800%22%2C%22TZNAME%3ACST%22%2C%22DTSTART%3A19700101T000000%22%2C%22END%3ASTANDARD%22%2C%22END%3AVTIMEZONE%22%5D%7Dfunction%20Te(e)%7Blet%20t%3D5381%3Bfor(let%20n%3D0%3Bn%3Ce.length%3Bn%2B%3D1)t%3Dt*33%5Ee.charCodeAt(n)%3Breturn(t%3E%3E%3E0).toString(36)%7Dconst%20x%3D%5B%22MON%22%2C%22TUE%22%2C%22WED%22%2C%22THU%22%2C%22FRI%22%2C%22SAT%22%2C%22SUN%22%5D%2Ch%3D%2F(%5Cd%7B1%2C2%7D%3A%5Cd%7B2%7D)%5Cs*%5B-%E2%80%93%5D%5Cs*(%5Cd%7B1%2C2%7D%3A%5Cd%7B2%7D)%2F%2Cw%3D%2F%5Cb%5BA-Z%5D%7B2%2C4%7D%5Cs%3F%5Cd%7B3%7D%5BA-Z%5D%3F%5Cb%2Fi%2CO%3D%2F%5Cb(%3F%3ALecture%7CTutorial%7CLab%7CLaboratory%7CSeminar%7CWorkshop%7CPractical)%5Cb%2Fi%2CA%3D%2F%5Cb(%3F%3ASIP%5Cs*%5B-%E2%80%93%5D%3F%5Cs*)%3F(%3F%3AEB%7CIR%7CCB%7CSD%7CBS%7CPB%7CSA%7CMA%7CHS%7CSC)%5Cs*%5B-%E2%80%93%5D%3F%5Cs*%5BA-Z%5D%3F%5Cd%7B2%2C4%7D%5Cb%2Fi%2CT%3D%2F%5CbWeek%5Cs*%3A%3F%5Cs*(%5Cd%2B(%3F%3A%5Cs*-%5Cs*%5Cd*)%3F(%3F%3A%5Cs*%2C%5Cs*%5Cd%2B(%3F%3A%5Cs*-%5Cs*%5Cd*)%3F)*)%2Fi%2Cv%3D%22table%2C%20td%2C%20div%2C%20span%22%2Cbe%3D%22iframe%2C%20frame%22%2Che%3D500%3Bfunction%20F(e)%7Bconst%20t%3Dge(e)%3Breturn%20t.length%3E0%3Ft%3Ape(e)%7Dfunction%20Ee()%7Bconst%20e%3Dye()%3Breturn%7Bevents%3Ae.document%3FF(e.document)%3A%5B%5D%2C...e.document%3F%7Bdocument%3Ae.document%7D%3A%7B%7D%2Cdebug%3Ae.debug%7D%7Dfunction%20ye(e%3Ddocument)%7Bconst%20t%3DP(e)%2Cn%3D%5B%5D%2Cr%3D%5B%5D%2Co%3Dnew%20Set%3Breturn%20o.add(e)%2Ct.isTimetableLike%26%26r.push(%7Bdocument%3Ae%2Cscore%3At.score%7D)%2CW(e%2Co%2Cn%2Cr)%2Cr.sort((i%2Ca)%3D%3Ea.score-i.score)%2C%7B...r%5B0%5D%3F%7Bdocument%3Ar%5B0%5D.document%7D%3A%7B%7D%2Cdebug%3A%7BcurrentUrl%3AG(e)%2CdocumentTitle%3Ae.title%7C%7C%22(untitled)%22%2CiframeCount%3An.length%2CbodyPreview%3At.bodyPreview%2CtopDocument%3A%7BelementCount%3At.elementCount%2Cscore%3At.score%2Csignals%3At.signals%7D%2Cframes%3An%7D%7D%7Dfunction%20De(e)%7Bconst%20t%3D%5B%22Timetable%20detection%20debug%3A%22%2C%60Current%20URL%3A%20%24%7Be.currentUrl%7D%60%2C%60Document%20title%3A%20%24%7Be.documentTitle%7D%60%2C%60Iframes%2Fframes%20found%3A%20%24%7Be.iframeCount%7D%60%2C%60Top%20document%20score%3A%20%24%7Be.topDocument.score%7D%60%2C%60Top%20document%20elements%20scanned%3A%20%24%7Be.topDocument.elementCount%7D%60%2C%60Top%20document%20signals%3A%20%24%7BZ(e.topDocument.signals)%7D%60%2C%60Body%20preview%3A%20%24%7Be.bodyPreview%7C%7C%22(empty)%22%7D%60%5D%3Bif(e.frames.length%3D%3D%3D0)t.push(%22Frame%20details%3A%20none%22)%3Belse%7Bt.push(%22Frame%20details%3A%22)%3Bfor(const%20n%20of%20e.frames)t.push(%5B%60%23%24%7Bn.index%7D%60%2C%60accessible%3D%24%7Bn.accessible%3F%22yes%22%3A%22no%22%7D%60%2C%60url%3D%24%7Bn.url%3F%3F%22(unknown)%22%7D%60%2C%60title%3D%24%7Bn.title%3F%3F%22(unknown)%22%7D%60%2C%60score%3D%24%7Bn.score%3F%3F%22n%2Fa%22%7D%60%2C%60elements%3D%24%7Bn.elementCount%3F%3F%22n%2Fa%22%7D%60%2Cn.signals%3F%60signals%3D%24%7BZ(n.signals)%7D%60%3Avoid%200%2Cn.error%3F%60error%3D%24%7Bn.error%7D%60%3Avoid%200%2Cn.bodyPreview%3F%60body%3D%22%24%7Bn.bodyPreview%7D%22%60%3Avoid%200%5D.filter(Boolean).join(%22%3B%20%22))%7Dreturn%20t.join(%60%0A%60)%7Dfunction%20ge(e)%7Breturn%20Array.from(e.querySelectorAll(%22table.timetable%20.event%22)).map(Ne).filter(t%3D%3Et!%3D%3Dvoid%200)%7Dfunction%20pe(e)%7Bconst%20n%3Dwe(e).map(Se).filter(r%3D%3Er!%3D%3Dvoid%200)%3Breturn%20Fe(n)%7Dfunction%20W(e%2Ct%2Cn%2Cr)%7Bfor(const%20o%20of%20Array.from(e.querySelectorAll(be)))%7Bconst%20i%3Dn.length%2B1%3Btry%7Bconst%20a%3DMe(o)%3Bif(!a)%7Bn.push(%7Bindex%3Ai%2Caccessible%3A!1%2Cerror%3A%22No%20contentDocument%20available%22%7D)%3Bcontinue%7Dconst%20s%3DP(a)%3Bn.push(%7Bindex%3Ai%2Caccessible%3A!0%2Curl%3AG(a)%2Ctitle%3Aa.title%7C%7C%22(untitled)%22%2CelementCount%3As.elementCount%2Cscore%3As.score%2Csignals%3As.signals%2CbodyPreview%3As.bodyPreview%7D)%2Ct.has(a)%7C%7C(t.add(a)%2Cs.isTimetableLike%26%26r.push(%7Bdocument%3Aa%2Cscore%3As.score%7D)%2CW(a%2Ct%2Cn%2Cr))%7Dcatch(a)%7Bn.push(%7Bindex%3Ai%2Caccessible%3A!1%2Cerror%3Aa%20instanceof%20Error%3Fa.message%3AString(a)%7D)%7D%7D%7Dfunction%20P(e)%7Bconst%20t%3Dke(e)%2Cn%3DArray.from(e.querySelectorAll(v))%2Cr%3Dn.map(s%3D%3EE(s)).join(%60%0A%60)%2Co%3D%60%24%7Bt%7D%0A%24%7Br%7D%60%2Ci%3Dj(o)%2Ca%3DB(i)%3Breturn%7BbodyPreview%3Ad(t).slice(0%2Che)%2CelementCount%3An.length%2CisTimetableLike%3ACe(i%2Ca)%2Cscore%3Aa%2Csignals%3Ai%7D%7Dfunction%20j(e)%7Breturn%7BmoduleCodeCount%3Ay(e%2Cw)%2CactivityCount%3Ay(e%2CO)%2CroomCount%3Ay(e%2CA)%2CtimeRangeCount%3Ay(e%2Ch)%2CweekdayCount%3Axe(e)%2CweekTextCount%3Ay(e%2CT)%7D%7Dfunction%20B(e)%7Breturn%20Math.min(e.moduleCodeCount%2C5)*3%2BMath.min(e.activityCount%2C5)*2%2BMath.min(e.roomCount%2C5)*2%2BMath.min(e.timeRangeCount%2C5)*2%2BMath.min(e.weekdayCount%2C7)%2BMath.min(e.weekTextCount%2C5)*2%7Dfunction%20Ce(e%2Ct)%7Bconst%20n%3De.moduleCodeCount%3E0%26%26e.timeRangeCount%3E0%2Cr%3De.moduleCodeCount%3E0%26%26e.activityCount%3E0%2Co%3De.weekdayCount%3E0%26%26e.timeRangeCount%3E0%26%26e.weekTextCount%3E0%2Ci%3De.roomCount%3E0%26%26e.activityCount%3E0%26%26e.timeRangeCount%3E0%3Breturn%20t%3E%3D5%26%26(n%7C%7Cr%7C%7Co%7C%7Ci)%7Dfunction%20we(e)%7Bconst%20t%3DArray.from(e.querySelectorAll(v)).filter(n%3D%3EAe(E(n)))%3Breturn%20t.filter(n%3D%3E!t.some(r%3D%3Er!%3D%3Dn%26%26n.contains(r)))%7Dfunction%20Ae(e)%7Bconst%20t%3Dd(e)%3Bif(t.length%3C12)return!1%3Bconst%20n%3Dj(t)%3Breturn%20w.test(t)%26%26h.test(t)%26%26(O.test(t)%7C%7CA.test(t)%7C%7CT.test(t))%26%26B(n)%3E%3D7%7Dfunction%20Ne(e)%7Bvar%20i%3Bconst%20t%3De.closest(%22td.day-cell%22)%2Cn%3DY((t%3D%3Dnull%3Fvoid%200%3At.getAttribute(%22data-day%22))%3F%3F%22%22)%2Cr%3Dd(((i%3De.querySelector(%22.event-name%22))%3D%3Dnull%3Fvoid%200%3Ai.textContent)%3F%3F%22%22)%2Co%3DArray.from(e.querySelectorAll(%22.event-info%22)).map(a%3D%3Ed(a.textContent%3F%3F%22%22)).filter(Boolean)%3Breturn%20_(e%2Cn%2Cr%2Co)%7Dfunction%20Se(e)%7Bconst%20t%3DUe(e)%2Cn%3Dt.join(%60%0A%60)%2Cr%3DIe(e%2Cn)%2Co%3D%24e(t%2Cn)%3Breturn%20_(e%2Cr%2Co%2Ct)%7Dfunction%20_(e%2Ct%2Cn%2Cr)%7Bif(!t%7C%7C!n%7C%7Cr.length%3D%3D%3D0)return%3Bconst%20o%3Dr.join(%60%0A%60)%2Ci%3DLe(r%2Co)%2Ca%3Do.match(h)%2Cs%3Da%3FX(a%5B1%5D)%3Avoid%200%2Cu%3Da%3FX(a%5B2%5D)%3Avoid%200%3Bif(!i%7C%7C!s%7C%7C!u)return%3Bconst%20c%3Dr.filter(l%3D%3E!ve(l%2Cn)).filter(l%3D%3E!h.test(l)).filter(l%3D%3E!T.test(l)).map(l%3D%3El.replace(h%2C%22%22).replace(T%2C%22%22).trim()).filter(Boolean)%2Cf%3Dc.filter(l%3D%3EA.test(l)%7C%7C%2FNo%20Location%20Required%2Fi.test(l))%2Cm%3Dc.find(l%3D%3E!f.includes(l))%2CC%3Dc.filter(l%3D%3El!%3D%3Dm)%2CJ%3D(f.length%3E0%3Ff%3AC).join(%22%20%22).trim()%3Breturn%7Bday%3At%2Ctitle%3An%2C...m%3F%7Bteacher%3Am%7D%3A%7B%7D%2C...J%3F%7Blocation%3AJ%7D%3A%7B%7D%2CweekText%3Ai%2CstartTime%3As%2CendTime%3Au%7D%7Dfunction%20%24e(e%2Ct)%7Bconst%20n%3De.find(i%3D%3Ew.test(i))%2Co%3D(n%3F%3Ft).match(%2F%5Cb(%5BA-Z%5D%7B2%2C4%7D%5Cs%3F%5Cd%7B3%7D%5BA-Z%5D%3F(%3F%3A(%3F%3A%5Cs*%5B-%E2%80%93%5D%5Cs*%7C%5Cs%2B)(%3F%3ALecture%7CTutorial%7CLab%7CLaboratory%7CSeminar%7CWorkshop%7CPractical)%5Cb(%3F%3A%5Cs*%5B-%E2%80%93%5D%3F%5Cs*%5BA-Z%5D%5Cd%2B)%3F)%3F)%2Fi)%3Breturn%20d((o%3D%3Dnull%3Fvoid%200%3Ao%5B1%5D)%3F%3Fn%3F%3F%22%22)%7Dfunction%20Le(e%2Ct)%7Bconst%20r%3D(e.find(o%3D%3ET.test(o))%3F%3Ft).match(T)%3Breturn%20r%3F%2F%5EWeek%5Cs*%3A%2Fi.test(r%5B0%5D)%3Fd(r%5B0%5D)%3A%60Week%3A%20%24%7Bd(r%5B1%5D)%7D%60%3A%22%22%7Dfunction%20Ie(e%2Ct)%7Bconst%20n%3De.closest(%22%5Bdata-day%5D%22)%2Cr%3DY((n%3D%3Dnull%3Fvoid%200%3An.getAttribute(%22data-day%22))%3F%3F%22%22)%3Bif(r)return%20r%3Bconst%20o%3DS(t)%3Breturn%20o%7C%7CRe(e)%7Dfunction%20Re(e)%7Bconst%20t%3De.closest(%22td%2C%20th%22)%2Cn%3Dt%3D%3Dnull%3Fvoid%200%3At.closest(%22table%22)%3Bif(!t%7C%7C!n%7C%7Ctypeof%20t.cellIndex!%3D%22number%22)return%3Bconst%20r%3Dt.parentElement%3Bif(r)for(const%20o%20of%20Array.from(r.cells))%7Bconst%20i%3DS(E(o))%3Bif(i)return%20i%7Dfor(const%20o%20of%20Array.from(n.rows))%7Bconst%20i%3Do.cells%5Bt.cellIndex%5D%2Ca%3Di%3FS(E(i))%3Avoid%200%3Bif(a)return%20a%7D%7Dfunction%20Me(e)%7Bvar%20n%3Bconst%20t%3De%3Breturn%20t.contentDocument%3F%3F((n%3Dt.contentWindow)%3D%3Dnull%3Fvoid%200%3An.document)%7Dfunction%20ke(e)%7Bconst%20t%3De.body%3Breturn%20t%3Fd(t.innerText%3F%3FE(t))%3A%22%22%7Dfunction%20Ue(e)%7Bconst%20t%3De.innerText%3Bif(t)return%20N(t)%3Bconst%20n%3DArray.from(e.children).flatMap(r%3D%3EN(p(r))).filter(Boolean)%3Breturn%20n.length%3E1%3Fn%3AN(p(e))%7Dfunction%20E(e)%7Breturn%20d(p(e))%7Dfunction%20p(e)%7Bif(e.nodeType%3D%3D%3DNode.TEXT_NODE)return%20e.textContent%3F%3F%22%22%3Bif(e.nodeType!%3D%3DNode.ELEMENT_NODE)return%22%22%3Bconst%20t%3De%2Cn%3Dt.tagName.toUpperCase()%3Bif(n%3D%3D%3D%22BR%22)return%60%0A%60%3Bconst%20r%3DArray.from(t.childNodes).map(p).join(%22%20%22)%3Breturn%5B%22TABLE%22%2C%22TBODY%22%2C%22THEAD%22%2C%22TFOOT%22%2C%22TR%22%2C%22TD%22%2C%22TH%22%2C%22DIV%22%2C%22P%22%2C%22LI%22%5D.includes(n)%3F%60%0A%24%7Br%7D%0A%60%3Ar%7Dfunction%20N(e)%7Breturn%20e.replace(%2F%5Cu00a0%2Fg%2C%22%20%22).split(%2F%5Cr%3F%5Cn%2F).map(d).filter(Boolean)%7Dfunction%20d(e)%7Breturn%20e.replace(%2F%5Cu00a0%2Fg%2C%22%20%22).replace(%2F%5Cs%2B%2Fg%2C%22%20%22).trim()%7Dfunction%20X(e)%7Bconst%5Bt%2Cn%5D%3De.split(%22%3A%22)%2Cr%3DNumber(t)%2Co%3DNumber(n)%3Bif(!(!Number.isInteger(r)%7C%7C!Number.isInteger(o)%7C%7Cr%3C0%7C%7Cr%3E23%7C%7Co%3C0%7C%7Co%3E59))return%60%24%7BString(r).padStart(2%2C%220%22)%7D%3A%24%7BString(o).padStart(2%2C%220%22)%7D%60%7Dfunction%20Y(e)%7Bconst%20t%3De.trim().toUpperCase()%3Breturn%20x.includes(t)%3Ft%3Avoid%200%7Dfunction%20S(e)%7Bconst%20t%3Dd(e)%3Bif(%2F%5CbMon(%3F%3Aday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E4%B8%80%2F.test(t))return%22MON%22%3Bif(%2F%5CbTue(%3F%3Asday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E4%BA%8C%2F.test(t))return%22TUE%22%3Bif(%2F%5CbWed(%3F%3Anesday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E4%B8%89%2F.test(t))return%22WED%22%3Bif(%2F%5CbThu(%3F%3Arsday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E5%9B%9B%2F.test(t))return%22THU%22%3Bif(%2F%5CbFri(%3F%3Aday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E4%BA%94%2F.test(t))return%22FRI%22%3Bif(%2F%5CbSat(%3F%3Aurday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E5%85%AD%2F.test(t))return%22SAT%22%3Bif(%2F%5CbSun(%3F%3Aday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E6%97%A5%7C(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E5%A4%A9%2F.test(t))return%22SUN%22%7Dfunction%20xe(e)%7Breturn%20x.filter(t%3D%3EOe(t%2Ce)).length%7Dfunction%20Oe(e%2Ct)%7Bswitch(e)%7Bcase%22MON%22%3Areturn%2F%5CbMon(%3F%3Aday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E4%B8%80%2F.test(t)%3Bcase%22TUE%22%3Areturn%2F%5CbTue(%3F%3Asday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E4%BA%8C%2F.test(t)%3Bcase%22WED%22%3Areturn%2F%5CbWed(%3F%3Anesday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E4%B8%89%2F.test(t)%3Bcase%22THU%22%3Areturn%2F%5CbThu(%3F%3Arsday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E5%9B%9B%2F.test(t)%3Bcase%22FRI%22%3Areturn%2F%5CbFri(%3F%3Aday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E4%BA%94%2F.test(t)%3Bcase%22SAT%22%3Areturn%2F%5CbSat(%3F%3Aurday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E5%85%AD%2F.test(t)%3Bcase%22SUN%22%3Areturn%2F%5CbSun(%3F%3Aday)%3F%5Cb%2Fi.test(t)%7C%7C%2F(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E6%97%A5%7C(%3F%3A%E6%98%9F%E6%9C%9F%7C%E5%91%A8)%E5%A4%A9%2F.test(t)%7D%7Dfunction%20y(e%2Ct)%7Bvar%20r%3Bconst%20n%3Dnew%20RegExp(t.source%2C%60%24%7Bt.flags.replace(%22g%22%2C%22%22)%7Dg%60)%3Breturn((r%3De.match(n))%3D%3Dnull%3Fvoid%200%3Ar.length)%3F%3F0%7Dfunction%20Z(e)%7Breturn%5B%60module%3D%24%7Be.moduleCodeCount%7D%60%2C%60activity%3D%24%7Be.activityCount%7D%60%2C%60room%3D%24%7Be.roomCount%7D%60%2C%60time%3D%24%7Be.timeRangeCount%7D%60%2C%60weekday%3D%24%7Be.weekdayCount%7D%60%2C%60week%3D%24%7Be.weekTextCount%7D%60%5D.join(%22%2C%20%22)%7Dfunction%20G(e)%7Bvar%20t%3Btry%7Breturn((t%3De.location)%3D%3Dnull%3Fvoid%200%3At.href)%7C%7C%22(unknown)%22%7Dcatch%7Breturn%22(unavailable)%22%7D%7Dfunction%20ve(e%2Ct)%7Breturn%20d(e).toLowerCase()%3D%3D%3Dd(t).toLowerCase()%7Dfunction%20Fe(e)%7Bconst%20t%3Dnew%20Set%3Breturn%20e.filter(n%3D%3E%7Bconst%20r%3D%5Bn.day%2Cn.title%2Cn.weekText%2Cn.startTime%2Cn.endTime%2Cn.location%3F%3F%22%22%2Cn.teacher%3F%3F%22%22%5D.join(%22%7C%22)%3Breturn%20t.has(r)%3F!1%3A(t.add(r)%2C!0)%7D)%7Dconst%20We%3D%222026-03-02%22%2CPe%3D%2213%22%2CV%3D%22xjtlu_timetable.ics%22%2Cz%3D%60%0A%60%3Basync%20function%20D(e%3Ddocument%2Ct%3D%7B%7D)%7Bvar%20m%2CC%3Bconst%20n%3Dje(e)%2Cr%3Dn.events%3Bif(r.length%3D%3D%3D0)%7Bwindow.alert(Be(n.debug%2Ct.debug%7C%7Ce%3D%3D%3Ddocument))%3Breturn%7Dconst%20o%3D(m%3Dwindow.prompt(%22Enter%20Week%201%20Monday%20(YYYY-MM-DD)%3A%22%2CWe))%3D%3Dnull%3Fvoid%200%3Am.trim()%3Bif(o%3D%3D%3Dvoid%200)return%3Bif(!_e(o))%7Bwindow.alert(%22Week%201%20Monday%20must%20use%20YYYY-MM-DD%20format.%22)%3Breturn%7Dconst%20i%3D(C%3Dwindow.prompt(%22Enter%20Last%20Week%3A%22%2CPe))%3D%3Dnull%3Fvoid%200%3AC.trim()%3Bif(i%3D%3D%3Dvoid%200)return%3Bconst%20a%3DNumber(i)%3Bif(!Number.isInteger(a)%7C%7Ca%3C1)%7Bwindow.alert(%22Last%20Week%20must%20be%20a%20positive%20whole%20number.%22)%3Breturn%7Dconst%20s%3Dwindow.confirm(%22Add%20a%2030-minute%20reminder%20before%20each%20class%3F%22)%2Cu%3Dwindow.confirm(%22Add%20a%201-day%20reminder%20before%20each%20class%3F%22)%2Cc%3Doe(r%2C%7Bweek1Monday%3Ao%2ClastWeek%3Aa%7D)%3Bif(c.length%3D%3D%3D0)%7Bwindow.alert(%22No%20class%20occurrences%20could%20be%20generated.%20Please%20check%20the%20week%20range%20values.%22)%3Breturn%7Dconst%20f%3Due(%7Boccurrences%3Ac%2CcalendarName%3A%22XJTLU%20Timetable%22%2Ctimezone%3A%22Asia%2FShanghai%22%2Creminders%3A%7BthirtyMinutesBefore%3As%2ConeDayBefore%3Au%7D%7D)%3Bawait%20q(f%2CV)%2Cwindow.alert(%5B%22XJTLU%20timetable%20export%20complete.%22%2C%60Detected%20raw%20timetable%20events%3A%20%24%7Br.length%7D%60%2C%60Expanded%20class%20occurrences%3A%20%24%7Bc.length%7D%60%2C%60Filename%3A%20%24%7BV%7D%60%5D.join(z))%7Dfunction%20%24()%7BD().catch(e%3D%3E%7Bconst%20t%3De%20instanceof%20Error%3Fe.message%3AString(e)%3Bwindow.alert(%60XJTLU%20timetable%20export%20failed.%20%24%7Bt%7D%60)%7D)%7Dfunction%20H()%7BD(document%2C%7Bdebug%3A!0%7D).catch(e%3D%3E%7Bconst%20t%3De%20instanceof%20Error%3Fe.message%3AString(e)%3Bwindow.alert(%60XJTLU%20timetable%20export%20failed.%20%24%7Bt%7D%60)%7D)%7Dfunction%20je(e)%7Bif(e%3D%3D%3Ddocument)%7Bconst%20t%3DEe()%3Breturn%7Bevents%3At.events%2Cdebug%3At.debug%7D%7Dreturn%7Bevents%3AF(e)%7D%7Dfunction%20Be(e%2Ct)%7Bconst%20n%3D%22No%20timetable%20found.%20Please%20open%20your%20XJTLU%20e-Bridge%20timetable%20page%20first.%22%3Breturn!t%7C%7C!e%3Fn%3A%5Bn%2C%22%22%2CDe(e)%5D.join(z)%7Dfunction%20_e(e)%7Bif(!%2F%5E%5Cd%7B4%7D-%5Cd%7B2%7D-%5Cd%7B2%7D%24%2F.test(e))return!1%3Bconst%20t%3Dnew%20Date(%60%24%7Be%7DT00%3A00%3A00Z%60)%3Breturn!Number.isNaN(t.getTime())%26%26t.toISOString().slice(0%2C10)%3D%3D%3De%7Dreturn%20typeof%20window%3C%22u%22%26%26(window.XjtluTimetableExporter%3D%7Brun%3AD%2CrunDebug%3Ae%3D%3ED(e%3F%3Fdocument%2C%7Bdebug%3A!0%7D)%2Cstart%3A%24%2CstartDebug%3AH%7D%2C%24())%2Cb.runXjtluTimetableExporter%3DD%2Cb.startXjtluTimetableExporter%3D%24%2Cb.startXjtluTimetableExporterDebug%3DH%2CObject.defineProperty(b%2CSymbol.toStringTag%2C%7Bvalue%3A%22Module%22%7D)%2Cb%7D(%7B%7D)%3B})()
```

</details>

## 如何在 iPhone Safari 安装书签脚本

1. 复制上面的 bookmarklet URL。
2. 在 Safari 打开任意网页，例如本 README 页面。
3. 点分享按钮。
4. 选择 “添加书签”。
5. 保存后，打开 Safari 的书签列表。
6. 点 “编辑”。
7. 选择刚才保存的书签。
8. 名称改成 `Export XJTLU Timetable`。
9. 删除原网址，把 bookmarklet URL 粘贴到网址栏。
10. 保存。

iOS Safari 不能像桌面浏览器那样把链接拖到书签栏；必须先保存一个普通书签，再编辑它的网址。

## 如何在真实 XJTLU e-Bridge 课表页面使用

1. 在 iPhone Safari 登录 XJTLU e-Bridge。
2. 打开你的 timetable / 课表页面。
3. 确认课表表格已经显示出来，不要停留在登录页、空白页或加载中页面。
4. 打开 Safari 书签，点击 `Export XJTLU Timetable`。
5. 如果弹出 Week 1 Monday，输入第一教学周的星期一日期，例如 `2026-03-02`。
6. 如果弹出 Last Week，输入最后一个教学周，例如 `13`。
7. 选择是否添加提醒。
8. 等待生成 `xjtlu_timetable.ics`。

## 如何导入或分享生成的 .ics 文件

生成文件后，iOS 可能会显示分享面板或下载提示。可选做法：

1. 如果分享面板里有 Calendar / 日历，直接选择并确认导入。
2. 如果没有看到 Apple Calendar，先选择 “存储到文件”。
3. 打开 “文件” App，找到 `xjtlu_timetable.ics`。
4. 点开该文件，再用系统提示导入到日历。
5. 也可以把 `.ics` 分享给 Mac、iPad、Outlook、Google Calendar 或其他日历应用。

## 常见问题 / Troubleshooting

**提示 “No timetable found” 是什么意思？**

这通常表示当前页面上没有可读取的课表表格。请确认你已经打开 e-Bridge 的课表页面，并且课表内容已经显示出来。也可能是 XJTLU 更新了 e-Bridge 页面结构，当前解析器暂时不支持新的 DOM。

**为什么 iPhone 上不能直接拖动安装 bookmarklet？**

iOS Safari 不支持像桌面浏览器那样拖动链接到书签栏。必须先添加任意普通书签，再编辑书签，把网址替换成 bookmarklet。

**分享面板里没有 Apple Calendar 怎么办？**

先把 `.ics` 文件保存到 “文件” App，然后在 “文件” App 里手动打开它。iOS 通常会提示你导入日历。

**如果 XJTLU 改了课表页面怎么办？**

如果 e-Bridge 的 DOM 结构变化，解析器可能需要更新。可以提交 issue，并附上去除个人信息后的页面结构截图或 HTML 片段。

**如果课表在 iframe 里怎么办？**

脚本会尝试读取可访问的 iframe。但如果课表在跨域 iframe 里，浏览器安全策略会阻止 bookmarklet 读取内容，这种情况下可能无法导出。

**为什么要输入 Week 1 Monday？**

e-Bridge 课表通常只给出教学周和星期几。脚本需要知道第 1 周星期一是哪一天，才能计算每节课的真实日期。

## 隐私

本工具无服务器，所有解析、日期展开和 `.ics` 生成都在当前浏览器里完成。课表数据不会上传到任何服务器，也不会发送给本项目作者。

## 限制

- 这不是原生 iOS App。
- 这不是 App Store Safari 扩展。
- iOS bookmarklet 的安装步骤比安装 App 麻烦。
- Apple Calendar 导入 `.ics` 时可能仍需要用户手动确认。
- 如果 XJTLU 改变 e-Bridge 课表 DOM，解析器可能需要更新。
- 如果课表位于跨域 iframe 中，浏览器可能禁止脚本读取。

## For developers: macOS development and build process

开发环境：

- macOS
- Node.js 20+
- npm

常用命令：

```sh
npm install
npm run dev
npm test
npm run build
npm run print:bookmarklet
```

`npm run dev` 会启动本地 demo。`npm run build` 会生成：

- `dist/bookmarklet.js`
- `dist/bookmarklet.min.js`

`npm run print:bookmarklet` 会从 `dist/bookmarklet.min.js` 打印可复制的单行 bookmarklet URL。

## Project structure

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
docs/
  bookmarklet-url.txt
  index.html
```

## Disclaimer

这是一个非官方社区项目，与西交利物浦大学无隶属关系，也未获得西交利物浦大学认可或背书。

This is an unofficial community project and is not affiliated with or endorsed by Xi'an Jiaotong-Liverpool University.

## License

MIT
