import moment from 'moment';
import { Event } from '../components/EventsList';
import { colors } from '../constants/theme';

/**
 * Formats a date to a human-readable string
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Monday, January 1, 2024")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a date to a database key string (YYYY-MM-DD)
 * @param date - The date to format
 * @returns Formatted date key string (e.g., "2024-01-01")
 */
export const formatDateKey = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD');
};

/**
 * Sorts events by time in ascending order
 * @param events - Array of events to sort
 * @returns Sorted array of events
 */
export const sortEventsByTime = (events: Event[]): Event[] => {
  return [...events].sort((a, b) => {
    const timeA = a.time.toLowerCase();
    const timeB = b.time.toLowerCase();
    return timeA.localeCompare(timeB);
  });
};

/**
 * Prepares event data by trimming strings and handling optional fields
 * @param eventData - Raw event data object
 * @returns Prepared event data with trimmed strings
 */
export const prepareEventData = (eventData: {
  title: string;
  time: string;
  description?: string;
  color?: string;
}): Event => {
  return {
    id: '',
    title: eventData.title.trim(),
    time: eventData.time.trim(),
    description: eventData.description?.trim() || undefined,
    color: eventData.color || colors.primary,
  };
};

/**
 * Gets default event data structure
 * @returns Default event data object
 */
export const getDefaultEventData = () => {
  return {
    title: '',
    time: '',
    description: '',
    color: colors.primary,
  };
};
