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
javascript:(()=>{var%20XjtluTimetableExporter%3Dfunction(f)%7B%22use%20strict%22%3Bconst%20g%3D%22text%2Fcalendar%3Bcharset%3Dutf-8%22%2CN%3D%22xjtlu_timetable.ics%22%3Basync%20function%20x(e%2Ct%3DN)%7Bconst%20r%3Dt.trim()%7C%7CN%2Co%3Dk(e%2Cr)%2Cn%3Do%3F%3Fnew%20Blob(%5Be%5D%2C%7Btype%3Ag%7D)%3Btry%7Bif(o%26%26await%20O(o))return%3BF(n%2Cr)%7Dcatch(a)%7BW(a)%7D%7Dasync%20function%20O(e)%7Bconst%20t%3Dnavigator%3Bif(!t.share%7C%7C!t.canShare%7C%7C!t.canShare(%7Bfiles%3A%5Be%5D%7D))return!1%3Btry%7Breturn%20await%20t.share(%7Bfiles%3A%5Be%5D%2Ctitle%3A%22XJTLU%20Timetable%22%2Ctext%3A%22XJTLU%20timetable%20calendar%20file%22%7D)%2C!0%7Dcatch(r)%7Breturn%20r%20instanceof%20DOMException%26%26r.name%3D%3D%3D%22AbortError%22%7D%7Dfunction%20k(e%2Ct)%7Bif(!(typeof%20File%3E%22u%22))return%20new%20File(%5Be%5D%2Ct%2C%7Btype%3Ag%7D)%7Dfunction%20F(e%2Ct)%7Bconst%20r%3DURL.createObjectURL(e)%2Co%3Ddocument.createElement(%22a%22)%3Bo.href%3Dr%2Co.download%3Dt%2Co.rel%3D%22noopener%22%2Co.style.display%3D%22none%22%2Cdocument.body.append(o)%2Co.click()%2Co.remove()%2Cwindow.setTimeout(()%3D%3E%7BURL.revokeObjectURL(r)%7D%2C1e3)%7Dfunction%20W(e)%7Bconst%20t%3De%20instanceof%20Error%3Fe.message%3AString(e)%3Bwindow.alert(%60Could%20not%20download%20or%20share%20the%20calendar%20file.%20%24%7Bt%7D%60)%7Dfunction%20X(e%2Ct)%7Bconst%20r%3DMath.floor(t)%3Bif(!Number.isFinite(r)%7C%7Cr%3C1)return%5B%5D%3Bconst%20o%3De.replace(%2F%5Cu00a0%2Fg%2C%22%20%22).trim().replace(%2F%5EWeek%5Cs*%3A%5Cs*%2Fi%2C%22%22).trim()%3Bif(!o)return%5B%5D%3Bconst%20n%3Dnew%20Set%3Bfor(const%20a%20of%20o.split(%22%2C%22))%7Bconst%20i%3Da.trim()%3Bif(!i)continue%3Bconst%20c%3Di.match(%2F%5E(%5Cd%2B)%24%2F)%3Bif(c)%7Bn.add(Number(c%5B1%5D))%3Bcontinue%7Dconst%20s%3Di.match(%2F%5E(%5Cd%2B)%5Cs*-%5Cs*%24%2F)%3Bif(s)%7Bp(n%2CNumber(s%5B1%5D)%2Cr)%3Bcontinue%7Dconst%20u%3Di.match(%2F%5E(%5Cd%2B)%5Cs*-%5Cs*(%5Cd%2B)%24%2F)%3Bif(u)%7Bconst%20l%3DNumber(u%5B1%5D)%2Cm%3DNumber(u%5B2%5D)%3Bl%3C%3Dm%26%26p(n%2Cl%2Cm)%7D%7Dreturn%5B...n%5D.filter(a%3D%3ENumber.isInteger(a)%26%26a%3E%3D1%26%26a%3C%3Dr).sort((a%2Ci)%3D%3Ea-i)%7Dfunction%20p(e%2Ct%2Cr)%7Bif(!(!Number.isInteger(t)%7C%7C!Number.isInteger(r)))for(let%20o%3Dt%3Bo%3C%3Dr%3Bo%2B%3D1)e.add(o)%7Dconst%20_%3D%7BMON%3A0%2CTUE%3A1%2CWED%3A2%2CTHU%3A3%2CFRI%3A4%2CSAT%3A5%2CSUN%3A6%7D%3Bfunction%20j(e%2Ct)%7Bconst%20r%3DP(t.week1Monday)%3Breturn%20r%3Fe.flatMap(n%3D%3EX(n.weekText%2Ct.lastWeek).map(i%3D%3E%7Bconst%20c%3DY(r%2C(i-1)*7%2B_%5Bn.day%5D)%2Cs%3Dv(c)%2Cu%3Dn.location%3F%3F%22%22%3Breturn%7BsourceId%3A%60xjtlu%3A%24%7Bn.title%7D%3A%24%7Bs%7D%3A%24%7Bn.startTime%7D%3A%24%7Bn.endTime%7D%3A%24%7Bu%7D%60%2Ctitle%3An.title%2CstartDate%3A%60%24%7Bs%7DT%24%7Bn.startTime%7D%3A00%60%2CendDate%3A%60%24%7Bs%7DT%24%7Bn.endTime%7D%3A00%60%2C...n.location%3F%7Blocation%3An.location%7D%3A%7B%7D%2C...n.teacher%3F%7Bteacher%3An.teacher%7D%3A%7B%7D%2CweekText%3An.weekText%2CoriginalTime%3A%60%24%7Bn.startTime%7D%20-%20%24%7Bn.endTime%7D%60%2CweekNumber%3Ai%7D%7D)).sort((n%2Ca)%3D%3E%7Bconst%20i%3Dn.startDate.localeCompare(a.startDate)%3Breturn%20i%3D%3D%3D0%3Fn.title.localeCompare(a.title)%3Ai%7D)%3A%5B%5D%7Dfunction%20P(e)%7Bconst%20t%3De.match(%2F%5E(%5Cd%7B4%7D)-(%5Cd%7B2%7D)-(%5Cd%7B2%7D)%24%2F)%3Bif(!t)return%3Bconst%20r%3DNumber(t%5B1%5D)%2Co%3DNumber(t%5B2%5D)%2Cn%3DNumber(t%5B3%5D)%2Ca%3Dnew%20Date(Date.UTC(r%2Co-1%2Cn))%3Bif(!(a.getUTCFullYear()!%3D%3Dr%7C%7Ca.getUTCMonth()!%3D%3Do-1%7C%7Ca.getUTCDate()!%3D%3Dn))return%20a%7Dfunction%20Y(e%2Ct)%7Bconst%20r%3Dnew%20Date(e.getTime())%3Breturn%20r.setUTCDate(r.getUTCDate()%2Bt)%2Cr%7Dfunction%20v(e)%7Breturn%20e.toISOString().slice(0%2C10)%7Dconst%20A%3D%60%5Cr%0A%60%2CB%3D%60%0A%60%3Bfunction%20Z(e)%7Bvar%20a%2Ci%3Bconst%20t%3De.timezone%3F%3F%22Asia%2FShanghai%22%2Cr%3De.calendarName%3F%3F%22XJTLU%20Timetable%22%2Co%3Dz(new%20Date)%2Cn%3D%5B%22BEGIN%3AVCALENDAR%22%2C%22VERSION%3A2.0%22%2C%22PRODID%3A-%2F%2FXJTLU%20Timetable%20Exporter%2F%2FEN%22%2C%22CALSCALE%3AGREGORIAN%22%2C%22METHOD%3APUBLISH%22%2C%60X-WR-TIMEZONE%3A%24%7Bt%7D%60%2C%60X-WR-CALNAME%3A%24%7BT(r)%7D%60%5D%3Bt%3D%3D%3D%22Asia%2FShanghai%22%26%26n.push(...J())%3Bfor(const%20c%20of%20e.occurrences)%7Bconst%20s%3Dw(c.startDate)%2Cu%3Dw(c.endDate)%3B!s%7C%7C!u%7C%7C(n.push(%22BEGIN%3AVEVENT%22%2C%60UID%3A%24%7Bq(c.sourceId)%7D%40xjtlu-timetable-exporter%60%2C%60DTSTAMP%3A%24%7Bo%7D%60%2C%60DTSTART%3BTZID%3D%24%7Bt%7D%3A%24%7Bs%7D%60%2C%60DTEND%3BTZID%3D%24%7Bt%7D%3A%24%7Bu%7D%60%2C%60SUMMARY%3A%24%7BT(c.title)%7D%60%2C%60LOCATION%3A%24%7BT(G(c.location))%7D%60%2C%60DESCRIPTION%3A%24%7BT(V(c))%7D%60)%2C(a%3De.reminders)!%3Dnull%26%26a.thirtyMinutesBefore%26%26n.push(...S(%22-PT30M%22))%2C(i%3De.reminders)!%3Dnull%26%26i.oneDayBefore%26%26n.push(...S(%22-P1D%22))%2Cn.push(%22END%3AVEVENT%22))%7Dreturn%20n.push(%22END%3AVCALENDAR%22)%2C%60%24%7Bn.join(A)%7D%24%7BA%7D%60%7Dfunction%20T(e)%7Breturn(e%3F%3F%22%22).replace(%2F%5C%5C%2Fg%2C%22%5C%5C%5C%5C%22).replace(%2F%5Cr%5Cn%7C%5Cr%7C%5Cn%2Fg%2C%22%5C%5Cn%22).replace(%2F%2C%2Fg%2C%22%5C%5C%2C%22).replace(%2F%3B%2Fg%2C%22%5C%5C%3B%22)%7Dfunction%20V(e)%7Breturn%5B%60Teacher%3A%20%24%7Be.teacher%3F%3F%22%22%7D%60%2C%60Week%3A%20%24%7Be.weekText%7D%60%2C%60Original%20time%3A%20%24%7Be.originalTime%7D%60%2C%22Source%3A%20XJTLU%20e-Bridge%22%5D.join(B)%7Dfunction%20G(e)%7Bconst%20t%3D(e%3F%3F%22%22).trim()%3Breturn!t%7C%7Ct.toLowerCase()%3D%3D%3D%22no%20location%20required%22%7C%7Ct.includes(%22%E8%A5%BF%E4%BA%A4%E5%88%A9%E7%89%A9%E6%B5%A6%22)%3Ft%3A%60%24%7Bt%7D%2C%20%E8%A5%BF%E4%BA%A4%E5%88%A9%E7%89%A9%E6%B5%A6%60%7Dfunction%20w(e)%7Bconst%20t%3De.match(%2F%5E(%5Cd%7B4%7D)-(%5Cd%7B2%7D)-(%5Cd%7B2%7D)%5BT%5Cs%5D(%5Cd%7B1%2C2%7D)%3A(%5Cd%7B2%7D)(%3F%3A%3A(%5Cd%7B2%7D))%3F%24%2F)%3Bif(t)return%60%24%7Bt%5B1%5D%7D%24%7Bt%5B2%5D%7D%24%7Bt%5B3%5D%7DT%24%7Bt%5B4%5D.padStart(2%2C%220%22)%7D%24%7Bt%5B5%5D%7D%24%7Bt%5B6%5D%3F%3F%2200%22%7D%60%7Dfunction%20z(e)%7Breturn%20e.toISOString().replace(%2F%5B-%3A%5D%2Fg%2C%22%22).replace(%2F%5C.%5Cd%7B3%7DZ%24%2F%2C%22Z%22)%7Dfunction%20S(e)%7Breturn%5B%22BEGIN%3AVALARM%22%2C%22ACTION%3ADISPLAY%22%2C%22DESCRIPTION%3AClass%20reminder%22%2C%60TRIGGER%3A%24%7Be%7D%60%2C%22END%3AVALARM%22%5D%7Dfunction%20J()%7Breturn%5B%22BEGIN%3AVTIMEZONE%22%2C%22TZID%3AAsia%2FShanghai%22%2C%22X-LIC-LOCATION%3AAsia%2FShanghai%22%2C%22BEGIN%3ASTANDARD%22%2C%22TZOFFSETFROM%3A%2B0800%22%2C%22TZOFFSETTO%3A%2B0800%22%2C%22TZNAME%3ACST%22%2C%22DTSTART%3A19700101T000000%22%2C%22END%3ASTANDARD%22%2C%22END%3AVTIMEZONE%22%5D%7Dfunction%20q(e)%7Blet%20t%3D5381%3Bfor(let%20r%3D0%3Br%3Ce.length%3Br%2B%3D1)t%3Dt*33%5Ee.charCodeAt(r)%3Breturn(t%3E%3E%3E0).toString(36)%7Dconst%20H%3D%5B%22MON%22%2C%22TUE%22%2C%22WED%22%2C%22THU%22%2C%22FRI%22%2C%22SAT%22%2C%22SUN%22%5D%2Cb%3D%2F(%5Cd%7B1%2C2%7D%3A%5Cd%7B2%7D)%5Cs*-%5Cs*(%5Cd%7B1%2C2%7D%3A%5Cd%7B2%7D)%2F%3Bfunction%20E(e)%7Breturn%20Array.from(e.querySelectorAll(%22table.timetable%20.event%22)).map(Q).filter(t%3D%3Et!%3D%3Dvoid%200)%7Dfunction%20K()%7Bconst%20e%3DE(document)%3Breturn%20e.length%3E0%3Fe%3AI(document%2Cnew%20Set)%7Dfunction%20I(e%2Ct)%7Bvar%20o%3Bif(t.has(e))return%5B%5D%3Bt.add(e)%3Bconst%20r%3D%5B%5D%3Bfor(const%20n%20of%20Array.from(e.querySelectorAll(%22iframe%22)))try%7Bconst%20a%3Dn.contentDocument%3F%3F((o%3Dn.contentWindow)%3D%3Dnull%3Fvoid%200%3Ao.document)%3Bif(!a%7C%7Ct.has(a))continue%3Bconst%20i%3DE(a)%3Br.push(...i)%2Cr.push(...I(a%2Ct))%7Dcatch%7B%7Dreturn%20r%7Dfunction%20Q(e)%7Bvar%20U%3Bconst%20t%3De.closest(%22td.day-cell%22)%2Cr%3Dee((t%3D%3Dnull%3Fvoid%200%3At.getAttribute(%22data-day%22))%3F%3F%22%22)%2Co%3D%24(((U%3De.querySelector(%22.event-name%22))%3D%3Dnull%3Fvoid%200%3AU.textContent)%3F%3F%22%22)%2Cn%3DArray.from(e.querySelectorAll(%22.event-info%22)).map(d%3D%3E%24(d.textContent%3F%3F%22%22)).filter(Boolean)%3Bif(!r%7C%7C!o%7C%7Cn.length%3D%3D%3D0)return%3Bconst%20a%3Dn.findIndex(d%3D%3E%2F%5EWeek%5Cs*%3A%2Fi.test(d))%2Ci%3Dn.findIndex(d%3D%3Eb.test(d))%2Cc%3Da%3E%3D0%3Fn%5Ba%5D%3A%22%22%2Cs%3Di%3E%3D0%3Fn%5Bi%5D.match(b)%3Avoid%200%2Cu%3Ds%3FL(s%5B1%5D)%3Avoid%200%2Cl%3Ds%3FL(s%5B2%5D)%3Avoid%200%3Bif(!c%7C%7C!u%7C%7C!l)return%3Bconst%20m%3Dn.filter((d%2CR)%3D%3ER!%3D%3Da%26%26R!%3D%3Di)%2CC%3Dm%5B0%5D%2CM%3Dm.slice(1).join(%22%20%22).trim()%3Breturn%7Bday%3Ar%2Ctitle%3Ao%2C...C%3F%7Bteacher%3AC%7D%3A%7B%7D%2C...M%3F%7Blocation%3AM%7D%3A%7B%7D%2CweekText%3Ac%2CstartTime%3Au%2CendTime%3Al%7D%7Dfunction%20%24(e)%7Breturn%20e.replace(%2F%5Cu00a0%2Fg%2C%22%20%22).replace(%2F%5Cs%2B%2Fg%2C%22%20%22).trim()%7Dfunction%20L(e)%7Bconst%5Bt%2Cr%5D%3De.split(%22%3A%22)%2Co%3DNumber(t)%2Cn%3DNumber(r)%3Bif(!(!Number.isInteger(o)%7C%7C!Number.isInteger(n)%7C%7Co%3C0%7C%7Co%3E23%7C%7Cn%3C0%7C%7Cn%3E59))return%60%24%7BString(o).padStart(2%2C%220%22)%7D%3A%24%7BString(n).padStart(2%2C%220%22)%7D%60%7Dfunction%20ee(e)%7Bconst%20t%3De.trim().toUpperCase()%3Breturn%20H.includes(t)%3Ft%3Avoid%200%7Dconst%20te%3D%222026-03-02%22%2Cne%3D%2213%22%2Cy%3D%22xjtlu_timetable.ics%22%2Cre%3D%60%0A%60%3Basync%20function%20h(e%3Ddocument)%7Bvar%20u%2Cl%3Bconst%20t%3Doe(e)%3Bif(t.length%3D%3D%3D0)%7Bwindow.alert(%22No%20timetable%20found.%20Please%20open%20your%20XJTLU%20e-Bridge%20timetable%20page%20first.%22)%3Breturn%7Dconst%20r%3D(u%3Dwindow.prompt(%22Enter%20Week%201%20Monday%20(YYYY-MM-DD)%3A%22%2Cte))%3D%3Dnull%3Fvoid%200%3Au.trim()%3Bif(r%3D%3D%3Dvoid%200)return%3Bif(!ae(r))%7Bwindow.alert(%22Week%201%20Monday%20must%20use%20YYYY-MM-DD%20format.%22)%3Breturn%7Dconst%20o%3D(l%3Dwindow.prompt(%22Enter%20Last%20Week%3A%22%2Cne))%3D%3Dnull%3Fvoid%200%3Al.trim()%3Bif(o%3D%3D%3Dvoid%200)return%3Bconst%20n%3DNumber(o)%3Bif(!Number.isInteger(n)%7C%7Cn%3C1)%7Bwindow.alert(%22Last%20Week%20must%20be%20a%20positive%20whole%20number.%22)%3Breturn%7Dconst%20a%3Dwindow.confirm(%22Add%20a%2030-minute%20reminder%20before%20each%20class%3F%22)%2Ci%3Dwindow.confirm(%22Add%20a%201-day%20reminder%20before%20each%20class%3F%22)%2Cc%3Dj(t%2C%7Bweek1Monday%3Ar%2ClastWeek%3An%7D)%3Bif(c.length%3D%3D%3D0)%7Bwindow.alert(%22No%20class%20occurrences%20could%20be%20generated.%20Please%20check%20the%20week%20range%20values.%22)%3Breturn%7Dconst%20s%3DZ(%7Boccurrences%3Ac%2CcalendarName%3A%22XJTLU%20Timetable%22%2Ctimezone%3A%22Asia%2FShanghai%22%2Creminders%3A%7BthirtyMinutesBefore%3Aa%2ConeDayBefore%3Ai%7D%7D)%3Bawait%20x(s%2Cy)%2Cwindow.alert(%5B%22XJTLU%20timetable%20export%20complete.%22%2C%60Detected%20raw%20timetable%20events%3A%20%24%7Bt.length%7D%60%2C%60Expanded%20class%20occurrences%3A%20%24%7Bc.length%7D%60%2C%60Filename%3A%20%24%7By%7D%60%5D.join(re))%7Dfunction%20D()%7Bh().catch(e%3D%3E%7Bconst%20t%3De%20instanceof%20Error%3Fe.message%3AString(e)%3Bwindow.alert(%60XJTLU%20timetable%20export%20failed.%20%24%7Bt%7D%60)%7D)%7Dfunction%20oe(e)%7Breturn%20e%3D%3D%3Ddocument%3FK()%3AE(e)%7Dfunction%20ae(e)%7Bif(!%2F%5E%5Cd%7B4%7D-%5Cd%7B2%7D-%5Cd%7B2%7D%24%2F.test(e))return!1%3Bconst%20t%3Dnew%20Date(%60%24%7Be%7DT00%3A00%3A00Z%60)%3Breturn!Number.isNaN(t.getTime())%26%26t.toISOString().slice(0%2C10)%3D%3D%3De%7Dreturn%20typeof%20window%3C%22u%22%26%26(window.XjtluTimetableExporter%3D%7Brun%3Ah%2Cstart%3AD%7D%2CD())%2Cf.runXjtluTimetableExporter%3Dh%2Cf.startXjtluTimetableExporter%3DD%2CObject.defineProperty(f%2CSymbol.toStringTag%2C%7Bvalue%3A%22Module%22%7D)%2Cf%7D(%7B%7D)%3B})()
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
