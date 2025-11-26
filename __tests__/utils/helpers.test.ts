import {
  formatDate,
  formatDateKey,
  sortEventsByTime,
  prepareEventData,
  getDefaultEventData,
} from '../../src/utils/helpers';
import { colors } from '../../src/constants/theme';
import { Event } from '../../src/components/EventsList';

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('January');
    });
  });

  describe('formatDateKey', () => {
    it('should format date to YYYY-MM-DD format', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDateKey(date);
      expect(formatted).toBe('2024-01-15');
    });
  });

  describe('sortEventsByTime', () => {
    it('should sort events by time ascending', () => {
      const events = [
        { id: '1', title: 'Event 1', time: '14:00', color: colors.primary },
        { id: '2', title: 'Event 2', time: '09:00', color: colors.primary },
        { id: '3', title: 'Event 3', time: '12:00', color: colors.primary },
      ];
      const sorted = sortEventsByTime(events);
      expect(sorted[0].time).toBe('09:00');
      expect(sorted[1].time).toBe('12:00');
      expect(sorted[2].time).toBe('14:00');
    });

    it('should handle empty array', () => {
      const events: Event[] = [];
      const sorted = sortEventsByTime(events);
      expect(sorted).toEqual([]);
    });

    it('should handle single event', () => {
      const events = [
        { id: '1', title: 'Event 1', time: '14:00', color: colors.primary },
      ];
      const sorted = sortEventsByTime(events);
      expect(sorted).toHaveLength(1);
      expect(sorted[0].time).toBe('14:00');
    });

    it('should handle events with different case times', () => {
      const events = [
        { id: '1', title: 'Event 1', time: '14:00', color: colors.primary },
        { id: '2', title: 'Event 2', time: '09:00', color: colors.primary },
        { id: '3', title: 'Event 3', time: '12:00', color: colors.primary },
      ];
      const sorted = sortEventsByTime(events);
      expect(sorted[0].time).toBe('09:00');
      expect(sorted[1].time).toBe('12:00');
      expect(sorted[2].time).toBe('14:00');
    });
  });

  describe('prepareEventData', () => {
    it('should trim strings and set defaults', () => {
      const eventData = {
        title: '  Test Event  ',
        time: '  14:00  ',
        description: '  Description  ',
      };
      const prepared = prepareEventData(eventData);
      expect(prepared.title).toBe('Test Event');
      expect(prepared.time).toBe('14:00');
      expect(prepared.description).toBe('Description');
      expect(prepared.color).toBe(colors.primary);
    });

    it('should handle missing optional fields', () => {
      const eventData = {
        title: 'Test Event',
        time: '14:00',
      };
      const prepared = prepareEventData(eventData);
      expect(prepared.title).toBe('Test Event');
      expect(prepared.time).toBe('14:00');
      expect(prepared.description).toBeUndefined();
      expect(prepared.color).toBe(colors.primary);
    });

    it('should use provided color', () => {
      const eventData = {
        title: 'Test Event',
        time: '14:00',
        color: '#FF0000',
      };
      const prepared = prepareEventData(eventData);
      expect(prepared.color).toBe('#FF0000');
    });

    it('should handle empty description string', () => {
      const eventData = {
        title: 'Test Event',
        time: '14:00',
        description: '   ',
      };
      const prepared = prepareEventData(eventData);
      expect(prepared.description).toBeUndefined();
    });

    it('should handle description with only whitespace', () => {
      const eventData = {
        title: 'Test Event',
        time: '14:00',
        description: '\t\n  \t',
      };
      const prepared = prepareEventData(eventData);
      expect(prepared.description).toBeUndefined();
    });
  });

  describe('getDefaultEventData', () => {
    it('should return default event data structure', () => {
      const defaultData = getDefaultEventData();
      expect(defaultData.title).toBe('');
      expect(defaultData.time).toBe('');
      expect(defaultData.description).toBe('');
      expect(defaultData.color).toBe(colors.primary);
    });
  });
});
