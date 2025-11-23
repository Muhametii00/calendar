import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import EventsList, { Event } from '../components/EventsList';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '../constants/theme';
import {
  getEventsForDate,
  initializeSampleEvents,
} from '../utils/eventsService';

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: spacing.sm,
  },
  eventsSection: {
    marginTop: spacing.sm,
  },
  settingsContainer: {
    flex: 1,
    padding: spacing.lg,
    minHeight: 500,
  },
  logoutButton: {
    height: 52,
    backgroundColor: '#FF3B30',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    ...shadows.button,
  },
  logoutButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 200,
  },
  loaderText: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});
