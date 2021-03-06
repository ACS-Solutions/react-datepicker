import {
  isSameDay,
  isDayDisabled,
  allDaysDisabledBefore,
  allDaysDisabledAfter
} from '../src/date_utils'
import moment from 'moment'

describe('date_utils', function () {
  describe('isSameDay', function () {
    it('should return true for null dates', function () {
      expect(isSameDay(null, null)).to.be.true
    })

    it('should return false for a null and non-null date', function () {
      expect(isSameDay(moment(), null)).to.be.false
      expect(isSameDay(null, moment())).to.be.false
    })

    it('should return true for non-equal dates', function () {
      expect(isSameDay(moment('2016-02-10'), moment('2016-02-11'))).to.be.false
    })

    it('should return true for equal dates', function () {
      expect(isSameDay(moment('2016-02-10'), moment('2016-02-10'))).to.be.true
    })
  })

  describe('isDayDisabled', function () {
    it('should be enabled by default', () => {
      const day = moment()
      expect(isDayDisabled(day)).to.be.false
    })

    it('should be enabled if on the min date', () => {
      const day = moment()
      expect(isDayDisabled(day, { minDate: day })).to.be.false
    })

    it('should be disabled if before the min date', () => {
      const day = moment()
      const minDate = day.clone().add(1, 'day')
      expect(isDayDisabled(day, { minDate })).to.be.true
    })

    it('should be enabled if on the max date', () => {
      const day = moment()
      expect(isDayDisabled(day, { maxDate: day })).to.be.false
    })

    it('should be disabled if after the max date', () => {
      const day = moment()
      const maxDate = day.clone().subtract(1, 'day')
      expect(isDayDisabled(day, { maxDate })).to.be.true
    })

    it('should be disabled if in excluded dates', () => {
      const day = moment()
      expect(isDayDisabled(day, { excludeDates: [day] })).to.be.true
    })

    it('should be enabled if in included dates', () => {
      const day = moment()
      expect(isDayDisabled(day, { includeDates: [day] })).to.be.false
    })

    it('should be disabled if not in included dates', () => {
      const day = moment()
      const includeDates = [day.clone().add(1, 'day')]
      expect(isDayDisabled(day, { includeDates })).to.be.true
    })

    it('should be enabled if date filter returns true', () => {
      const day = moment()
      const filterDate = d => d.isSame(day)
      expect(isDayDisabled(day, { filterDate })).to.be.false
    })

    it('should be disabled if date filter returns false', () => {
      const day = moment()
      const filterDate = d => !d.isSame(day)
      expect(isDayDisabled(day, { filterDate })).to.be.true
    })

    it('should not allow date filter to modify input date', () => {
      const day = moment()
      const dayClone = day.clone()
      const filterDate = d => {
        d.add(1, 'day')
        return true
      }
      isDayDisabled(day, { filterDate })
      expect(day.isSame(dayClone)).to.be.true
    })
  })

  describe('allDaysDisabledBefore', () => {
    it('should return false by default', () => {
      expect(allDaysDisabledBefore(moment(), 'month')).to.be.false
    })

    it('should return true if min date is in the same unit', () => {
      const day = moment('2016-03-19')
      const minDate = moment('2016-03-01')
      expect(allDaysDisabledBefore(day, 'month', { minDate })).to.be.true
    })

    it('should return false if min date is in the previous unit', () => {
      const day = moment('2016-03-19')
      const minDate = moment('2016-02-29')
      expect(allDaysDisabledBefore(day, 'month', { minDate })).to.be.false
    })

    it('should return true if previous unit is before include dates', () => {
      const day = moment('2016-03-19')
      const includeDates = [moment('2016-03-01')]
      expect(allDaysDisabledBefore(day, 'month', { includeDates })).to.be.true
    })
  })

  describe('allDaysDisabledAfter', () => {
    it('should return false by default', () => {
      expect(allDaysDisabledAfter(moment(), 'month')).to.be.false
    })

    it('should return true if max date is in the same unit', () => {
      const day = moment('2016-03-19')
      const maxDate = moment('2016-03-31')
      expect(allDaysDisabledAfter(day, 'month', { maxDate })).to.be.true
    })

    it('should return false if max date is in the next unit', () => {
      const day = moment('2016-03-19')
      const maxDate = moment('2016-04-01')
      expect(allDaysDisabledAfter(day, 'month', { maxDate })).to.be.false
    })

    it('should return true if next unit is after include dates', () => {
      const day = moment('2016-03-19')
      const includeDates = [moment('2016-03-01')]
      expect(allDaysDisabledAfter(day, 'month', { includeDates })).to.be.true
    })
  })
})
