import { TermFunctionBase } from '@comunica/bus-function-factory';
import type {
  DayTimeDurationLiteral,
} from '@comunica/utils-expression-evaluator';
import {
  defaultedDateTimeRepresentation,
  defaultedDurationRepresentation,
  addDurationToDateTime,
  DateTimeLiteral,
  declare,
  TypeURL,
  DateLiteral,
  TimeLiteral,
} from '@comunica/utils-expression-evaluator';

function adjustDateTime([ date, timezone ]: [DateTimeLiteral, DayTimeDurationLiteral]): DateTimeLiteral {
  const typeDate = date.typedValue;
  const typeDur = timezone.typedValue;
  if (typeDate.zoneHours === undefined) {
    return new DateTimeLiteral({
      ...typeDate,
      zoneHours: typeDur.hours,
      zoneMinutes: typeDur.minutes,
    });
  }
  // Adjust time: result = arg + (newTimezone - oldTimezone)
  // zoneMinutes is always defined when zoneHours is defined (ITimeZoneRepresentation invariant)
  const timeDif = defaultedDurationRepresentation({
    hours: (typeDur.hours ?? 0) - typeDate.zoneHours,
    minutes: (typeDur.minutes ?? 0) - typeDate.zoneMinutes!,
  });
  const firstOp = addDurationToDateTime(typeDate, timeDif);
  return new DateTimeLiteral({
    ...firstOp,
    zoneHours: typeDur.hours,
    zoneMinutes: typeDur.minutes,
  });
}

/**
 * https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md
 * https://www.w3.org/TR/xpath-functions/#func-adjust-dateTime-to-timezone
 */
export class TermFunctionAdjust extends TermFunctionBase {
  public constructor() {
    super({
      arity: 2,
      operator: 'adjust',
      overloads: declare('adjust')
        // ExprEval.context.getSafe(KeysExpressionEvaluator.defaultTimeZone)
        .set(
          [ TypeURL.XSD_DATE_TIME, TypeURL.XSD_DAY_TIME_DURATION ],
          () => adjustDateTime,
        ).set(
          [ TypeURL.XSD_DATE, TypeURL.XSD_DAY_TIME_DURATION ],
          () => ([ date, timezone ]: [DateLiteral, DayTimeDurationLiteral]) => {
            const asDateTime = new DateTimeLiteral(defaultedDateTimeRepresentation(date.typedValue));
            const asTimedDate = adjustDateTime([ asDateTime, timezone ]);
            const tv = asTimedDate.typedValue;
            return new DateLiteral({
              day: tv.day,
              month: tv.month,
              year: tv.year,
              zoneHours: tv.zoneHours,
              zoneMinutes: tv.zoneMinutes,
            });
          },
        ).set(
          [ TypeURL.XSD_TIME, TypeURL.XSD_DAY_TIME_DURATION ],
          () => ([ time, timezone ]: [TimeLiteral, DayTimeDurationLiteral]) => {
            const asDateTime = new DateTimeLiteral({
              ...time.typedValue,
              year: 1972,
              month: 12,
              day: 31,
            });
            const asTimedDate = adjustDateTime([ asDateTime, timezone ]);
            const tv = asTimedDate.typedValue;
            return new TimeLiteral({
              hours: tv.hours,
              minutes: tv.minutes,
              seconds: tv.seconds,
              zoneHours: tv.zoneHours,
              zoneMinutes: tv.zoneMinutes,
            });
          },
        ).collect(),
    });
  }
}
