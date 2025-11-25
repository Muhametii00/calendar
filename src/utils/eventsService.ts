import { firestore } from '../config/firebase';
import moment from 'moment';
import { Event } from '../components/EventsList';

const formatDateKey = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD');
};

export const getEventsForDate = async (
  userId: string,
  date: Date,
): Promise<Event[]> => {
  try {
    const dateKey = formatDateKey(date);
    const eventsSnapshot = await firestore()
      .collection('events')
      .where('userId', '==', userId)
      .where('date', '==', dateKey)
      .get();

    const events: Event[] = [];
    eventsSnapshot.forEach(doc => {
      const data = doc.data();
      events.push({
        id: doc.id,
        title: data.title,
        time: data.time,
        description: data.description,
        color: data.color,
      });
    });

    return events.sort((a, b) => {
      const timeA = a.time.toLowerCase();
      const timeB = b.time.toLowerCase();
      return timeA.localeCompare(timeB);
    });
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

export const saveEvent = async (
  userId: string,
  date: Date,
  event: Event,
): Promise<void> => {
  if (!userId || userId.trim() === '') {
    throw new Error('User ID is required to save an event');
  }
  try {
    const dateKey = formatDateKey(date);
    await firestore()
      .collection('events')
      .add({
        userId: userId.trim(),
        date: dateKey,
        title: event.title,
        time: event.time,
        description: event.description || '',
        color: event.color || '#007AFF',
      });
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
};

export const updateEvent = async (
  userId: string,
  date: Date,
  eventId: string,
  event: Event,
): Promise<void> => {
  if (!userId || userId.trim() === '') {
    throw new Error('User ID is required to update an event');
  }
  if (!eventId || eventId.trim() === '') {
    throw new Error('Event ID is required to update an event');
  }
  try {
    const dateKey = formatDateKey(date);
    await firestore()
      .collection('events')
      .doc(eventId)
      .update({
        userId: userId.trim(),
        date: dateKey,
        title: event.title,
        time: event.time,
        description: event.description || '',
        color: event.color || '#007AFF',
      });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};
