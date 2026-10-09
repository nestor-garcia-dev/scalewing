---
'@scalewing/react': minor
---

`DateField` and `CalendarButton` take an optional `today` (`YYYY-MM-DD`): the day the calendar marks as today (`aria-current="date"`), opens on when the field is empty, and picks with **Today**. It defaults to the device's local date, as before. Pass the business's own day when it keeps a time zone the device may not share, so a phone in UTC at 10 PM in New York no longer rings tomorrow while `max` disables it. An empty or malformed `today` throws a `RangeError`.
