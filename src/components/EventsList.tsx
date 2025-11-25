import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../constants/theme';
import { styles } from '../styles/EventListStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatDate } from '../utils/helpers';

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
  onEditEvent?: (event: Event) => void;
}

function EventsList({ events, selectedDate, onEditEvent }: EventsListProps) {
  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => onEditEvent?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.eventColorBar} />
      <View style={styles.eventContent}>
        <Text style={styles.eventTime}>{item.time}</Text>
        <Text style={styles.eventTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.eventDescription}>{item.description}</Text>
        )}
      </View>
      {onEditEvent && (
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => onEditEvent(item)}
        >
          <Icon name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default React.memo(EventsList);
