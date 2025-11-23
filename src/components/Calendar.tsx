import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/CalendarStyles';

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

export default React.memo(Calendar);
