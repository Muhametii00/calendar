import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { Event } from '../components/EventsList';

const EVENTS_STORAGE_KEY = '@calendar_events';

const formatDateKey = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD');
};

export const getEventsForDate = async (date: Date): Promise<Event[]> => {
  try {
    const dateKey = formatDateKey(date);
    const allEventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!allEventsJson) return [];

    const allEvents: Record<string, Event[]> = JSON.parse(allEventsJson);
    return allEvents[dateKey] || [];
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

export const saveEvent = async (date: Date, event: Event): Promise<void> => {
  try {
    const dateKey = formatDateKey(date);
    const allEventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    const allEvents: Record<string, Event[]> = allEventsJson
      ? JSON.parse(allEventsJson)
      : {};

    if (!allEvents[dateKey]) {
      allEvents[dateKey] = [];
    }

    allEvents[dateKey].push(event);
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(allEvents));
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
};

export const deleteEvent = async (
  date: Date,
  eventId: string,
): Promise<void> => {
  try {
    const dateKey = formatDateKey(date);
    const allEventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    if (!allEventsJson) return;

    const allEvents: Record<string, Event[]> = JSON.parse(allEventsJson);
    if (allEvents[dateKey]) {
      allEvents[dateKey] = allEvents[dateKey].filter(e => e.id !== eventId);
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(allEvents));
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Initialize with some sample events for demonstration
export const initializeSampleEvents = async (): Promise<void> => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sampleEvents: Record<string, Event[]> = {
      [formatDateKey(today)]: [
        {
          id: '1',
          title: 'Team Meeting',
          time: '10:00 AM',
          description: 'Weekly team sync',
          color: '#007AFF',
        },
        {
          id: '2',
          title: 'Lunch with Client',
          time: '12:30 PM',
          description: 'Discuss project requirements',
          color: '#34C759',
        },
      ],
      [formatDateKey(tomorrow)]: [
        {
          id: '3',
          title: 'Project Review',
          time: '2:00 PM',
          description: 'Review Q4 progress',
          color: '#FF9500',
        },
      ],
    };

    await AsyncStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify(sampleEvents),
    );
  } catch (error) {
    console.error('Error initializing sample events:', error);
  }
};
