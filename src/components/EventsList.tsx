import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export interface Event {
  id: string;
  title: string;
  time: string;
  description?: string;
  color?: string;
}

interface EventsListProps {
  events: Event[];
  selectedDate: Date;
}

function EventsList({ events, selectedDate }: EventsListProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventCard}>
      <View
        style={[
          styles.eventColorBar,
          { backgroundColor: item.color || colors.primary },
        ]}
      />
      <View style={styles.eventContent}>
        <Text style={styles.eventTime}>{item.time}</Text>
        <Text style={styles.eventTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.eventDescription}>{item.description}</Text>
        )}
      </View>
    </View>
  );

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No meetings scheduled for this day
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      <Text style={styles.eventsCount}>
        {events.length} {events.length === 1 ? 'meeting' : 'meetings'}
      </Text>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // outer FlatList handles scrolling
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  dateText: {
    ...typography.title,
    fontSize: 24,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventsCount: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: spacing.md,
  },
  eventTime: {
    ...typography.small,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  eventTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventDescription: {
    ...typography.small,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.subtitle,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default React.memo(EventsList);
