import dayjs, { UnitType } from 'dayjs';

const steps: Record<
  number,
  {
    value: number;
    unit: UnitType;
  }
> = {
  0: {
    value: 0,
    unit: 'second',
  },
  1: {
    value: 30,
    unit: 'minute',
  },
  2: {
    value: 24,
    unit: 'hour',
  },
  3: {
    value: 7,
    unit: 'day',
  },
  4: {
    value: 14,
    unit: 'day',
  },
  5: {
    value: 1,
    unit: 'month',
  },
  6: {
    value: 2,
    unit: 'month',
  },
};

const getRepeatTimeIfFail = (): Date => dayjs().add(24, 'hour').toDate();
const getRepeatTimeIfRepeatAgain = (): Date => dayjs().add(12, 'hour').toDate();

const getNewRepeatTimeByStep = (step = 0): Date => {
  return dayjs().add(steps[step].value, steps[step].unit).toDate();
};

export { steps, getRepeatTimeIfFail, getRepeatTimeIfRepeatAgain };
export default getNewRepeatTimeByStep;
