import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { colors } from '../constants/theme';
import { styles } from '../styles/EventListStyles';

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

export default React.memo(EventsList);
