import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Header, Calendar, Event, EventModal, EventsList } from '../components';
import { styles } from '../styles/HomeScreenStyles';
import { colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import {
  saveEvent,
  getEventsForDate,
  updateEvent,
} from '../utils/eventsService';
import { eventSchema, getValidationErrors } from '../utils/validation';
import {
  formatDate,
  getDefaultEventData,
  prepareEventData,
} from '../utils/helpers';
import * as yup from 'yup';

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventData, setEventData] = useState(getDefaultEventData());
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const loadEventsForDate = useCallback(
    async (date: Date) => {
      if (!user?.uid) return;

      setIsLoadingEvents(true);
      try {
        const dateEvents = await getEventsForDate(user.uid, date);
        setEvents(dateEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    },
    [user?.uid],
  );

  useEffect(() => {
    if (user?.uid) {
      loadEventsForDate(selectedDate);
    }
  }, [user?.uid, loadEventsForDate, selectedDate]);

  const handleAddEvent = async () => {
    if (!user?.uid) {
      return;
    }

    try {
      await eventSchema.validate(eventData, { abortEarly: false });
      setValidationErrors({});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = getValidationErrors(error);
        setValidationErrors(errors);
        return;
      }
    }

    try {
      const event = prepareEventData(eventData);
      await saveEvent(user.uid, selectedDate, event);
      resetModal();
      setShowAddModal(false);
      await loadEventsForDate(selectedDate);
      Alert.alert('Success', 'Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event. Please try again.');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventData({
      title: event.title,
      time: event.time,
      description: event.description || '',
      color: event.color || getDefaultEventData().color,
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async () => {
    if (!user?.uid || !editingEvent) {
      Alert.alert('Error', 'You must be logged in to edit events');
      return;
    }

    try {
      await eventSchema.validate(eventData, { abortEarly: false });
      setValidationErrors({});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = getValidationErrors(error);
        setValidationErrors(errors);
        return;
      }
    }

    try {
      const updatedEvent = {
        ...prepareEventData(eventData),
        id: editingEvent.id,
      };

      await updateEvent(user.uid, selectedDate, editingEvent.id, updatedEvent);
      resetModal();
      setEditingEvent(null);
      setShowEditModal(false);
      await loadEventsForDate(selectedDate);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event. Please try again.');
    }
  };

  const resetModal = () => {
    setEventData(getDefaultEventData());
    setEditingEvent(null);
    setValidationErrors({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetModal();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetModal();
  };

  return (
    <View style={styles.container}>
      <Header title="Calendar" subtitle={formatDate(selectedDate)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
        {isLoadingEvents ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <EventsList
            events={events}
            selectedDate={selectedDate}
            onEditEvent={handleEditEvent}
          />
        )}
      </ScrollView>

      <EventModal
        visible={showAddModal}
        mode="add"
        selectedDate={selectedDate}
        eventData={eventData}
        onClose={handleCloseAddModal}
        onSave={handleAddEvent}
        onEventDataChange={setEventData}
        validationErrors={validationErrors}
      />

      <EventModal
        visible={showEditModal}
        mode="edit"
        selectedDate={selectedDate}
        eventData={eventData}
        onClose={handleCloseEditModal}
        onSave={handleUpdateEvent}
        onEventDataChange={setEventData}
        validationErrors={validationErrors}
      />
    </View>
  );
}
