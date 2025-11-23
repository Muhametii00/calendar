import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Calendar, EventsList, Event } from '../components';
import { colors } from '../constants/theme';
import { styles } from '../styles/HomeScreenStyles';
import {
  getEventsForDate,
  initializeSampleEvents,
} from '../utils/eventsService';

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  useEffect(() => {
    initializeSampleEvents();
    loadEventsForDate(selectedDate);
  }, []);

  const loadEventsForDate = async (date: Date) => {
    setIsLoadingEvents(true);
    try {
      const dateEvents = await getEventsForDate(date);
      setEvents(dateEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    await loadEventsForDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Calendar"
        subtitle={selectedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      />
      <ScrollView>
        <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        {isLoadingEvents ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loaderText}>Loading events...</Text>
          </View>
        ) : (
          <EventsList events={events} selectedDate={selectedDate} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
