import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

function Calendar({
  onDateSelect,
  selectedDate: externalSelectedDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    externalSelectedDate || new Date(),
  );

  useEffect(() => {
    if (externalSelectedDate) {
      setSelectedDate(externalSelectedDate);
      setCurrentDate(
        new Date(
          externalSelectedDate.getFullYear(),
          externalSelectedDate.getMonth(),
          1,
        ),
      );
    }
  }, [externalSelectedDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleDateSelect = (day: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const emptyDays = Array(firstDayOfMonth).fill(null);

    // Empty cells for days before the first day of the month
    emptyDays.forEach((_, index) => {
      days.push(<View key={`empty-${index}`} style={styles.dayCell} />);
    });

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
            isSelected && styles.selectedCell,
          ]}
          onPress={() => handleDateSelect(day)}
        >
          <Text
            style={[
              styles.dayText,
              isToday && styles.todayText,
              isSelected && styles.selectedText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>,
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {monthNames[month]} {year}
        </Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dayNamesRow}>
        {dayNames.map(day => (
          <View key={day} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.inputBackground,
  },
  navButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  monthText: {
    ...typography.title,
    fontSize: 20,
    color: colors.text.primary,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dayNameText: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  dayText: {
    ...typography.body,
    color: colors.text.primary,
  },
  todayCell: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.md,
  },
  todayText: {
    fontWeight: '600',
    color: colors.primary,
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  selectedText: {
    fontWeight: '600',
    color: colors.text.inverse,
  },
});

export default React.memo(Calendar);
